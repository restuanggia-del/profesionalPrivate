package models

import "time"

type Enrollment struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	CourseID  uint      `json:"course_id"`
	Progress  int       `json:"progress" gorm:"default:0"`
	CreatedAt time.Time `json:"created_at"`
}
