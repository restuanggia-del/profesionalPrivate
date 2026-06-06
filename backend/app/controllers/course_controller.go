package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

type CreateCourseRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

func CreateCourse(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id")

	if userID == nil {
		helpers.JSON(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var req CreateCourseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if req.Title == "" {
		helpers.JSON(w, http.StatusBadRequest, "Title is required", nil)
		return
	}

	course := models.Course{
		Title:     req.Title,
		Desc:      req.Description,
		TeacherID: userID.(uint),
	}

	db := helpers.GetDB()
	db.Create(&course)

	helpers.JSON(w, http.StatusCreated, "Course created", course)
}

func GetMyCourses(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id")

	if userID == nil {
		helpers.JSON(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var courses []models.Course
	db := helpers.GetDB()

	db.Where("teacher_id = ?", userID).Find(&courses)

	helpers.JSON(w, http.StatusOK, "My courses", courses)
}
