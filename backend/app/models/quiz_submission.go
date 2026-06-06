package models

import "time"

type QuizSubmission struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	QuizID    uint      `json:"quiz_id"`
	Score     int       `json:"score"`
	CreatedAt time.Time `json:"created_at"`
}
