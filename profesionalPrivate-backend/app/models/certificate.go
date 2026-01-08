package models

import "time"

type Certificate struct {
	ID        uint      `gorm:"primaryKey"`
	UserID    uint
	CourseID  uint
	FilePath  string
	CreatedAt time.Time
}
