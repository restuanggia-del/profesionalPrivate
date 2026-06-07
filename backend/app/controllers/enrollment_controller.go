package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func JoinCourse(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id")
	if userID == nil {
		helpers.JSON(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var input struct {
		CourseID uint `json:"course_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if input.CourseID == 0 {
		helpers.JSON(w, http.StatusBadRequest, "course_id diperlukan", nil)
		return
	}

	db := helpers.GetDB()

	var course models.Course
	if err := db.First(&course, input.CourseID).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "Kelas tidak ditemukan", nil)
		return
	}

	var existing models.Enrollment
	result := db.Where("user_id = ? AND course_id = ?", userID, input.CourseID).First(&existing)
	if result.Error == nil {
		helpers.JSON(w, http.StatusConflict, "Kamu sudah terdaftar di kelas ini", nil)
		return
	}

	enrollment := models.Enrollment{
		UserID:   userID.(uint),
		CourseID: input.CourseID,
		Progress: 0,
	}

	if err := db.Create(&enrollment).Error; err != nil {
		helpers.JSON(w, http.StatusInternalServerError, "Gagal bergabung ke kelas", nil)
		return
	}

	helpers.JSON(w, http.StatusCreated, "Berhasil bergabung ke kelas", enrollment)
}
