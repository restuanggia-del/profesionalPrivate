package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

type ChartData struct {
	Labels          []string `json:"labels"`
	Students        []int    `json:"students"`
	QuizSubmissions []int    `json:"quiz_submissions"`
}

func ChartAnalytics(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()

	type Row struct {
		Week  string
		Count int
	}

	var studentRows []Row
	db.Raw(`
		SELECT TO_CHAR(created_at, 'YYYY-IW') AS week, COUNT(*) AS count
		FROM users
		WHERE role = 'student'
		GROUP BY week
		ORDER BY week
	`).Scan(&studentRows)

	var quizRows []Row
	db.Raw(`
		SELECT TO_CHAR(created_at, 'YYYY-IW') AS week, COUNT(*) AS count
		FROM quiz_submissions
		GROUP BY week
		ORDER BY week
	`).Scan(&quizRows)

	labels := []string{}
	students := []int{}
	quizzes := []int{}

	for i := 0; i < len(studentRows); i++ {
		labels = append(labels, studentRows[i].Week)
		students = append(students, studentRows[i].Count)

		if i < len(quizRows) {
			quizzes = append(quizzes, quizRows[i].Count)
		} else {
			quizzes = append(quizzes, 0)
		}
	}

	helpers.JSON(w, http.StatusOK, "Chart analytics", ChartData{
		Labels:          labels,
		Students:        students,
		QuizSubmissions: quizzes,
	})
}
