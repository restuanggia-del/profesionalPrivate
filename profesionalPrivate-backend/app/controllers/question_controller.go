package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

func CreateQuestion(w http.ResponseWriter, r *http.Request) {
	var input struct {
		QuizID   uint   `json:"quiz_id"`
		Question string `json:"question"`
		OptionA  string `json:"option_a"`
		OptionB  string `json:"option_b"`
		OptionC  string `json:"option_c"`
		OptionD  string `json:"option_d"`
		Answer   string `json:"answer"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	q := models.Question{
		QuizID:   input.QuizID,
		Question: input.Question,
		OptionA:  input.OptionA,
		OptionB:  input.OptionB,
		OptionC:  input.OptionC,
		OptionD:  input.OptionD,
		Answer:   input.Answer,
	}

	db := helpers.GetDB()
	db.Create(&q)

	helpers.JSON(w, http.StatusCreated, "Question created", q)
}
