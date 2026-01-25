package controllers

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func ChangeUserRole(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()
	params := mux.Vars(r)
	id, _ := strconv.Atoi(params["id"])

	type Req struct {
		Role string `json:"role"`
	}

	var req Req
	helpers.ParseJSON(r, &req)

	db.Model(&models.User{}).
		Where("id = ?", id).
		Update("role", req.Role)

	helpers.JSON(w, http.StatusOK, "Role updated", nil)
}

func SuspendUser(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	db := helpers.GetDB()

	if err := db.Model(&models.User{}).
		Where("id = ?", id).
		Update("is_active", false).Error; err != nil {
		helpers.JSON(w, http.StatusInternalServerError, "Failed to suspend user", nil)
		return
	}

	helpers.JSON(w, http.StatusOK, "User suspended", nil)
}

func GetAllUsers(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()

	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil || limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	var users []models.User
	var total int64

	if err := db.Model(&models.User{}).Count(&total).Error; err != nil {
		helpers.JSON(w, http.StatusInternalServerError, "Failed to count users", nil)
		return
	}

	if err := db.Offset(offset).Limit(limit).Find(&users).Error; err != nil {
		helpers.JSON(w, http.StatusInternalServerError, "Failed to fetch users", nil)
		return
	}

	helpers.JSON(w, http.StatusOK, "User list", map[string]interface{}{
		"data":  users,
		"page":  page,
		"limit": limit,
		"total": total,
	})
}
