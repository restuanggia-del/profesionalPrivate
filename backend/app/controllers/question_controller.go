package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
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

	if input.Question == "" || input.Answer == "" {
		helpers.JSON(w, http.StatusBadRequest, "Question dan answer wajib diisi", nil)
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

func DeleteQuestion(w http.ResponseWriter, r *http.Request) {
	db := helpers.GetDB()
	vars := mux.Vars(r)
	idStr := vars["id"]

	id, err := strconv.Atoi(idStr)
	if err != nil {
		helpers.JSON(w, http.StatusBadRequest, "ID tidak valid", nil)
		return
	}

	var q models.Question
	if err := db.First(&q, id).Error; err != nil {
		helpers.JSON(w, http.StatusNotFound, "Soal tidak ditemukan", nil)
		return
	}

	db.Delete(&q)
	helpers.JSON(w, http.StatusOK, "Soal berhasil dihapus", nil)
}
