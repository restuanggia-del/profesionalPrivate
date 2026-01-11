package controllers

import (
	"net/http"

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
		SELECT TO_CHAR(created_at, 'YYYY-IW') AS week, COUNT(*) AS count
		FROM users
		WHERE role = 'student'
		GROUP BY week
		ORDER BY week
	`).Scan(&studentStats)

	var quizStats []WeeklyStat
	db.Raw(`
		SELECT TO_CHAR(created_at, 'YYYY-IW') AS week, COUNT(*) AS count
		FROM quiz_submissions
		GROUP BY week
		ORDER BY week
	`).Scan(&quizStats)

	helpers.JSON(w, http.StatusOK, "Weekly analytics", map[string]interface{}{
		"students": studentStats,
		"quizzes":  quizStats,
	})
}
