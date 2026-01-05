package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func GetUsers(w http.ResponseWriter, r *http.Request) {
	var users []models.User
	db := helpers.GetDB()

	db.Find(&users)
	helpers.JSON(w, http.StatusOK, "List of users", users)
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	db := helpers.GetDB()
	db.Create(&user)

	helpers.JSON(w, http.StatusCreated, "User created", user)
}

func GetUserByID(w http.ResponseWriter, r *http.Request) {
	var user models.User
	params := mux.Vars(r)

	id, err := strconv.Atoi(params["id"])
	if err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid user id", nil)
		return
	}

	db := helpers.GetDB()
	result := db.First(&user, id)

	if result.Error != nil {
		helpers.JSON(w, http.StatusNotFound, "User not found", nil)
		return
	}

	helpers.JSON(w, http.StatusOK, "User found", user)
}
