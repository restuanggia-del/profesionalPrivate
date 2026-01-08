package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func QuizHistory(w http.ResponseWriter, r *http.Request) {
	userID := helpers.GetUserID(r)
	db := helpers.GetDB()

	var results []models.QuizResult
	db.Where("user_id = ?", userID).Find(&results)

	helpers.JSON(w, http.StatusOK, "Quiz history", results)
}
