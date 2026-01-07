package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func CreateLesson(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title    string `json:"title"`
		Content  string `json:"content"`
		CourseID uint   `json:"course_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	lesson := models.Lesson{
		Title:    input.Title,
		Content:  input.Content,
		CourseID: input.CourseID,
	}

	db := helpers.GetDB()
	db.Create(&lesson)

	helpers.JSON(w, http.StatusCreated, "Lesson created", lesson)
}
