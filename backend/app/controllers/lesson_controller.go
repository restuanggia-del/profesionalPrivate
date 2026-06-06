package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
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

func GetLessonsByCourse(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()

	vars := mux.Vars(r)
	courseIDStr := vars["course_id"]
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

	var lessons []models.Lesson
	db.Where("course_id = ?", courseID).Order("created_at ASC").Find(&lessons)

	helpers.JSON(w, http.StatusOK, "Lessons retrieved", lessons)
}

func UpdateLesson(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		helpers.JSON(w, http.StatusBadRequest, "ID tidak valid", nil)
		return
	}

	var lesson models.Lesson
	if err := db.First(&lesson, id).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "Materi tidak ditemukan", nil)
		return
	}

	var input struct {
		Title   string `json:"title"`
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if input.Title != "" {
		lesson.Title = input.Title
	}
	if input.Content != "" {
		lesson.Content = input.Content
	}

	db.Save(&lesson)
	helpers.JSON(w, http.StatusOK, "Materi berhasil diperbarui", lesson)
}

func DeleteLesson(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		helpers.JSON(w, http.StatusBadRequest, "ID tidak valid", nil)
		return
	}

	var lesson models.Lesson
	if err := db.First(&lesson, id).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "Materi tidak ditemukan", nil)
		return
	}

	db.Delete(&lesson)
	helpers.JSON(w, http.StatusOK, "Materi berhasil dihapus", nil)
}
