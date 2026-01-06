package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func Me(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id")

	if userID == nil {
		helpers.JSON(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var user models.User
	db := helpers.GetDB()

	if err := db.First(&user, userID).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "User not found", nil)
		return
	}

	user.Password = ""

	helpers.JSON(w, http.StatusOK, "User profile", user)
}
