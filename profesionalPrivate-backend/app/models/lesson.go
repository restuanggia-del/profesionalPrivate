package models

import "time"

type Lesson struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CourseID  uint      `json:"course_id"`
	CreatedAt time.Time `json:"created_at"`
}
