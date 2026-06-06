package models

import "time"

type LessonProgress struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	LessonID  uint      `json:"lesson_id"`
	Completed bool      `json:"completed"`
	CreatedAt time.Time `json:"created_at"`
}
