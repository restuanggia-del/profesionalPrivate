package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func CreateQuiz(w http.ResponseWriter, r *http.Request) {
	var input struct {
		CourseID uint   `json:"course_id"`
		Title    string `json:"title"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request", nil)
		return
	}

	quiz := models.Quiz{
		CourseID: input.CourseID,
		Title:    input.Title,
	}

	db := helpers.GetDB()
	db.Create(&quiz)

	helpers.JSON(w, http.StatusCreated, "Quiz created", quiz)
}
