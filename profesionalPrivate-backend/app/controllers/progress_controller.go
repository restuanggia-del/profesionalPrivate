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

	db := helpers.GetDB()

	var progress models.LessonProgress

	result := db.Where("user_id = ? AND lesson_id = ?", userID, input.LessonID).
		First(&progress)

	if result.RowsAffected == 0 {
		progress = models.LessonProgress{
			UserID:    userID,
			LessonID:  input.LessonID,
			Completed: true,
		}
		db.Create(&progress)
	} else {
		progress.Completed = true
		db.Save(&progress)
	}

	helpers.JSON(w, http.StatusOK, "Lesson marked as completed", progress)
}
