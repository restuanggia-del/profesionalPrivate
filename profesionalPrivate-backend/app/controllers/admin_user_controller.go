package controllers

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func AdminUsers(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()
	var users []models.User
	db.Find(&users)

	helpers.JSON(w, http.StatusOK, "All users", users)
}

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
