package models

import "time"

type QuizResult struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint
	QuizID    uint
	Score     int
	CreatedAt time.Time
}
