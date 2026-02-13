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

func StudentCourseDetail(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id")

	id := r.PathValue("id")

	db := helpers.GetDB()

	type Result struct {
		ID       uint   `json:"id"`
		Title    string `json:"title"`
		Desc     string `json:"description"`
		Progress int    `json:"progress"`
	}

	var result Result

	db.Table("courses").
		Select("courses.id, courses.title, courses.desc, enrollments.progress").
		Joins("JOIN enrollments ON enrollments.course_id = courses.id").
		Where("courses.id = ? AND enrollments.user_id = ?", id, userID).
		Scan(&result)

	if result.ID == 0 {
		helpers.JSON(w, http.StatusNotFound, "Course not found", nil)
		return
	}

	helpers.JSON(w, http.StatusOK, "Course detail", result)
}
