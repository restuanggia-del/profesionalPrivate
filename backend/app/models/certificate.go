package models

import "time"

type Certificate struct {
	ID        uint      `gorm:"primaryKey" json:"ID"`
	UserID    uint      `json:"UserID"`
	CourseID  uint      `json:"CourseID"`
	FilePath  string    `json:"FilePath"`
	CreatedAt time.Time `json:"CreatedAt"`
}
