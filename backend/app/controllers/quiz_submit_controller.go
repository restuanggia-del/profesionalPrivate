package controllers

import (
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

type SubmitQuizRequest struct {
	QuizID  uint            `json:"quiz_id"`
	Answers map[uint]string `json:"answers"`
}

func SubmitQuiz(w http.ResponseWriter, r *http.Request) {
	var req SubmitQuizRequest
	if err := helpers.ParseJSON(r, &req); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request", nil)
		return
	}

	userID := helpers.GetUserID(r)
	db := helpers.GetDB()

	var questions []models.Question
	db.Where("quiz_id = ?", req.QuizID).Find(&questions)

	score := 0
	submission := models.QuizSubmission{
		UserID: userID,
		QuizID: req.QuizID,
	}
	db.Create(&submission)

	for _, q := range questions {
		answer := req.Answers[q.ID]
		isCorrect := answer == q.Answer
		if isCorrect {
			score += 10
		}

		db.Create(&models.QuizAnswer{
			SubmissionID: submission.ID,
			QuestionID:   q.ID,
			Answer:       answer,
			IsCorrect:    isCorrect,
		})
	}

	db.Model(&submission).Update("score", score)

	db.Create(&models.QuizResult{
		UserID: userID,
		QuizID: req.QuizID,
		Score:  score,
	})

	if score >= 70 {
		var course models.Course
		db.Joins("JOIN quizzes ON quizzes.course_id = courses.id").
			Where("quizzes.id = ?", req.QuizID).
			First(&course)

		var existing models.Certificate
		if db.Where("user_id = ? AND course_id = ?", userID, course.ID).
			First(&existing).Error != nil {

			var user models.User
			db.First(&user, userID)

			path := helpers.GenerateCertificatePDF(user.Name, course.Title)

			db.Create(&models.Certificate{
				UserID:   userID,
				CourseID: course.ID,
				FilePath: path,
			})
		}
	}

	helpers.JSON(w, http.StatusOK, "Quiz submitted", map[string]interface{}{
		"score": score,
	})
}
