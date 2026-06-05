package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
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

// GetQuizzesByCourse — GET /api/teacher/quizzes?course_id=X
// atau GET /api/teacher/courses/{id}/quizzes
func GetQuizzesByCourse(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()

	// Coba ambil dari path variable dulu
	vars := mux.Vars(r)
	courseIDStr := vars["course_id"]

	// Kalau tidak ada di path, coba query param
	if courseIDStr == "" {
		courseIDStr = r.URL.Query().Get("course_id")
	}

	if courseIDStr == "" {
		helpers.JSON(w, http.StatusBadRequest, "course_id diperlukan", nil)
		return
	}

	courseID, err := strconv.Atoi(courseIDStr)
	if err != nil {
		helpers.JSON(w, http.StatusBadRequest, "course_id tidak valid", nil)
		return
	}

	var quizzes []models.Quiz
	db.Preload("Questions").
		Where("course_id = ?", courseID).
		Order("created_at DESC").
		Find(&quizzes)

	helpers.JSON(w, http.StatusOK, "Quizzes retrieved", quizzes)
}
