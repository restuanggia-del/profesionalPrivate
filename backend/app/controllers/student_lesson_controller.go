package controllers

import (
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

type LessonWithProgress struct {
	ID        uint   `json:"id"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	CourseID  uint   `json:"course_id"`
	Completed bool   `json:"completed"`
	CreatedAt string `json:"created_at"`
}

func StudentLessons(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id")
	if userID == nil {
		helpers.JSON(w, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	vars := mux.Vars(r)
	courseIDStr := vars["course_id"]

	courseID, err := strconv.Atoi(courseIDStr)
	if err != nil {
		helpers.JSON(w, http.StatusBadRequest, "course_id tidak valid", nil)
		return
	}

	db := helpers.GetDB()

	var lessons []models.Lesson
	db.Where("course_id = ?", courseID).Order("created_at ASC").Find(&lessons)

	var progresses []models.LessonProgress
	db.Joins("JOIN lessons ON lessons.id = lesson_progresses.lesson_id").
		Where("lesson_progresses.user_id = ? AND lessons.course_id = ? AND lesson_progresses.completed = true",
			userID, courseID).
		Find(&progresses)

	completedMap := make(map[uint]bool)
	for _, p := range progresses {
		completedMap[p.LessonID] = true
	}

	result := make([]LessonWithProgress, len(lessons))
	for i, l := range lessons {
		result[i] = LessonWithProgress{
			ID:        l.ID,
			Title:     l.Title,
			Content:   l.Content,
			CourseID:  l.CourseID,
			Completed: completedMap[l.ID],
			CreatedAt: l.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		}
	}

	helpers.JSON(w, http.StatusOK, "Lessons retrieved", result)
}
