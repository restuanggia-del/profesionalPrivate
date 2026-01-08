package models

import "time"

type Quiz struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CourseID  uint      `json:"course_id"`
	Title     string    `json:"title"`
	CreatedAt time.Time `json:"created_at"`
}
