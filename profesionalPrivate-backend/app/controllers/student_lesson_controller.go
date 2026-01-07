package controllers

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func StudentLessons(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	courseID, _ := strconv.Atoi(params["course_id"])

	var lessons []models.Lesson
	db := helpers.GetDB()

	db.Where("course_id = ?", courseID).Find(&lessons)

	helpers.JSON(w, http.StatusOK, "Course lessons", lessons)
}
