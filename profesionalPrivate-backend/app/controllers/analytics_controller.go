package controllers

import (
	"net/http"
	// "time"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

type WeeklyStat struct {
	Week  string `json:"week"`
	Count int    `json:"count"`
}

func WeeklyAnalytics(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()

	var studentStats []WeeklyStat
	db.Raw(`
		SELECT DATE_FORMAT(created_at, '%Y-%u') as week, COUNT(*) as count
		FROM users
		WHERE role = 'student'
		GROUP BY week
	`).Scan(&studentStats)

	var quizStats []WeeklyStat
	db.Raw(`
		SELECT DATE_FORMAT(created_at, '%Y-%u') as week, COUNT(*) as count
		FROM quiz_submissions
		GROUP BY week
	`).Scan(&quizStats)

	helpers.JSON(w, http.StatusOK, "Weekly analytics", map[string]interface{}{
		"students": studentStats,
		"quizzes":  quizStats,
	})
}
