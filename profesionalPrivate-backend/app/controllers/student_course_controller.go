package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

type StudentCourseResponse struct {
	ID       uint   `json:"id"`
	Title    string `json:"title"`
	Progress int    `json:"progress"`
}

func StudentCourses(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id")
	if userID == nil {
		helpers.JSON(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	db := helpers.GetDB()

	var result []StudentCourseResponse

	db.Table("courses").
		Select("courses.id, courses.title, enrollments.progress").
		Joins("JOIN enrollments ON enrollments.course_id = courses.id").
		Where("enrollments.user_id = ?", userID).
		Scan(&result)

	helpers.JSON(w, http.StatusOK, "My courses", result)
}
