package models

type QuizAnswer struct {
	ID           uint   `json:"id"`
	SubmissionID uint   `json:"submission_id"`
	QuestionID   uint   `json:"question_id"`
	Answer       string `json:"answer"`
	IsCorrect    bool   `json:"is_correct"`
}
