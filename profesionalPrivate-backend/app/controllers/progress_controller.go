package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func CompleteLesson(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	var input struct {
		LessonID uint `json:"lesson_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request", nil)
		return
	}

	progress := models.LessonProgress{
		UserID:    userID,
		LessonID:  input.LessonID,
		Completed: true,
	}

	db := helpers.GetDB()
	db.Create(&progress)

	helpers.JSON(w, http.StatusOK, "Lesson marked as completed", progress)
}
