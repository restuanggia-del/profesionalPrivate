package models

import "time"

type Question struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	QuizID    uint      `json:"quiz_id"`
	Question  string    `json:"question"`
	OptionA   string    `json:"option_a"`
	OptionB   string    `json:"option_b"`
	OptionC   string    `json:"option_c"`
	OptionD   string    `json:"option_d"`
	Answer    string    `json:"-"` // disembunyikan
	CreatedAt time.Time `json:"created_at"`
}
