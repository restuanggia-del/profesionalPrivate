package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func JoinCourse(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	var req struct {
		CourseID uint `json:"course_id"`
	}

	if err := helpers.ParseJSON(r, &req); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request", nil)
		return
	}

	db := helpers.GetDB()

	// Cek course ada atau tidak
	var course models.Course
	if err := db.First(&course, req.CourseID).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "Course not found", nil)
		return
	}

	// Cek sudah join atau belum
	var existing models.Enrollment
	if err := db.Where("user_id = ? AND course_id = ?", userID, req.CourseID).
		First(&existing).Error; err == nil {
		helpers.JSON(w, http.StatusBadRequest, "Already enrolled", nil)
		return
	}

	enrollment := models.Enrollment{
		UserID:   userID,
		CourseID: req.CourseID,
	}

	db.Create(&enrollment)

	helpers.JSON(w, http.StatusCreated, "Successfully joined course", enrollment)
}
