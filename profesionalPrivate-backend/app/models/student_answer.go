package models

import "time"

type StudentAnswer struct {
	ID         uint      `gorm:"primaryKey" json:"id"`
	UserID     uint      `json:"user_id"`
	QuestionID uint      `json:"question_id"`
	Answer     string    `json:"answer"`
	Correct    bool      `json:"correct"`
	CreatedAt  time.Time `json:"created_at"`
}
