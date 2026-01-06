package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func CreateCourse(w http.ResponseWriter, r *http.Request) {
	teacherID := r.Context().Value("user_id")

	if teacherID == nil {
		helpers.JSON(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var course models.Course

	if err := json.NewDecoder(r.Body).Decode(&course); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	course.TeacherID = teacherID.(uint)

	db := helpers.GetDB()
	db.Create(&course)

	helpers.JSON(w, http.StatusCreated, "Course created", course)
}
