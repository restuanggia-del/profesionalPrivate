package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func GetQuizForStudent(w http.ResponseWriter, r *http.Request) {
	quizID := r.URL.Query().Get("quiz_id")
	if quizID == "" {
		helpers.JSON(w, http.StatusBadRequest, "quiz_id is required", nil)
		return
	}

	var quiz models.Quiz
	db := helpers.GetDB()

	if err := db.Preload("Questions").First(&quiz, quizID).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "Quiz not found", nil)
		return
	}

	helpers.JSON(w, http.StatusOK, "Quiz loaded", quiz)
}
