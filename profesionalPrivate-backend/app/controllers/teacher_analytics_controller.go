package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func TeacherAnalytics(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()
	teacherID := helpers.GetUserID(r)

	var totalCourses int64
	var totalStudents int64
	var totalQuizzes int64
	var avgScore float64

	db.Model(&models.Course{}).
		Where("teacher_id = ?", teacherID).
		Count(&totalCourses)

	db.Raw(`
		SELECT COUNT(DISTINCT enrollments.user_id)
		FROM enrollments
		JOIN courses ON courses.id = enrollments.course_id
		WHERE courses.teacher_id = ?
	`, teacherID).Scan(&totalStudents)

	db.Raw(`
		SELECT COUNT(quizzes.id)
		FROM quizzes
		JOIN courses ON courses.id = quizzes.course_id
		WHERE courses.teacher_id = ?
	`, teacherID).Scan(&totalQuizzes)

	db.Raw(`
		SELECT COALESCE(AVG(score), 0)
		FROM quiz_submissions
		JOIN quizzes ON quizzes.id = quiz_submissions.quiz_id
		JOIN courses ON courses.id = quizzes.course_id
		WHERE courses.teacher_id = ?
	`, teacherID).Scan(&avgScore)

	helpers.JSON(w, http.StatusOK, "Teacher analytics", map[string]interface{}{
		"total_courses":  totalCourses,
		"total_students": totalStudents,
		"total_quizzes":  totalQuizzes,
		"average_score":  avgScore,
	})
}
