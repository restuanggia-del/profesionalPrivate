package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func StudentCourses(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id")
	if userID == nil {
		helpers.JSON(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	db := helpers.GetDB()

	var courses []models.Course

	db.Joins("JOIN enrollments ON enrollments.course_id = courses.id").
		Where("enrollments.user_id = ?", userID).
		Find(&courses)

	helpers.JSON(w, http.StatusOK, "My courses", courses)
}
