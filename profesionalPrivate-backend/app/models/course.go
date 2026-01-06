package models

import "time"

type Course struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	TeacherID   uint      `json:"teacher_id"`
	CreatedAt   time.Time `json:"created_at"`
}
