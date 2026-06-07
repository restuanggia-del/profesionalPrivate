package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func CompleteLesson(w http.ResponseWriter, r *http.Request) {
	userID := r.Context().Value("user_id").(uint)

	var input struct {
		LessonID uint `json:"lesson_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request", nil)
		return
	}

	db := helpers.GetDB()

	var existing models.LessonProgress
	result := db.Where("user_id = ? AND lesson_id = ?", userID, input.LessonID).First(&existing)

	if result.Error != nil {
		newProgress := models.LessonProgress{
			UserID:    userID,
			LessonID:  input.LessonID,
			Completed: true,
		}
		db.Create(&newProgress)
	} else if !existing.Completed {
		db.Model(&existing).Update("completed", true)
	}

	var lesson models.Lesson
	if err := db.First(&lesson, input.LessonID).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "Lesson not found", nil)
		return
	}

	var totalLessons int64
	db.Model(&models.Lesson{}).Where("course_id = ?", lesson.CourseID).Count(&totalLessons)

	if totalLessons == 0 {
		helpers.JSON(w, http.StatusOK, "Lesson marked as completed", nil)
		return
	}

	var completedLessons int64
	db.Raw(`
		SELECT COUNT(lp.id)
		FROM lesson_progresses lp
		JOIN lessons l ON l.id = lp.lesson_id
		WHERE lp.user_id = ? AND l.course_id = ? AND lp.completed = true
	`, userID, lesson.CourseID).Scan(&completedLessons)

	progressPct := int((completedLessons * 100) / totalLessons)

	db.Exec(
		"UPDATE enrollments SET progress = ? WHERE user_id = ? AND course_id = ?",
		progressPct, userID, lesson.CourseID,
	)

	helpers.JSON(w, http.StatusOK, "Lesson marked as completed", map[string]interface{}{
		"lesson_progress": input.LessonID,
		"course_progress": progressPct,
	})
}
