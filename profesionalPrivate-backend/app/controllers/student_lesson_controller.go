package controllers

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func StudentLessons(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	params := mux.Vars(r)
	courseID, _ := strconv.Atoi(params["course_id"])

	db := helpers.GetDB()

	var lessons []models.Lesson

	db.Raw(`
		SELECT l.*,
		CASE
			WHEN lp.id IS NULL THEN false
			ELSE true
		END AS completed
		FROM lessons l
		LEFT JOIN lesson_progresses lp
			ON lp.lesson_id = l.id
			AND lp.user_id = ?
		WHERE l.course_id = ?
	`, userID, courseID).Scan(&lessons)

	helpers.JSON(w, http.StatusOK, "Course lessons", lessons)
}
