package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/restuanggia/profesionalPrivate/app/helpers"
	"github.com/restuanggia/profesionalPrivate/app/models"
)

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"` // teacher | student
}

func Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	if req.Name == "" || req.Email == "" || req.Password == "" {
		helpers.JSON(w, http.StatusBadRequest, "All fields are required", nil)
		return
	}

	hashedPassword, err := helpers.HashPassword(req.Password)
	if err != nil {
		helpers.JSON(w, http.StatusInternalServerError, "Failed to hash password", nil)
		return
	}

	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
		Role:     req.Role,
	}

	db := helpers.GetDB()
	if err := db.Create(&user).Error; err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Email already registered", nil)
		return
	}

	helpers.JSON(w, http.StatusCreated, "User registered successfully", user)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		helpers.JSON(w, http.StatusBadRequest, "Invalid request body", nil)
		return
	}

	db := helpers.GetDB()
	var user models.User

	if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		helpers.JSON(w, http.StatusUnauthorized, "Email not found", nil)
		return
	}

	if err := helpers.CheckPassword(user.Password, input.Password); err != nil {
		helpers.JSON(w, http.StatusUnauthorized, "Wrong password", nil)
		return
	}

	token, err := helpers.GenerateToken(user.ID, user.Role)
	if err != nil {
		helpers.JSON(w, http.StatusInternalServerError, "Failed to generate token", nil)
		return
	}

	user.Password = ""

	helpers.JSON(w, http.StatusOK, "Login successful", map[string]interface{}{
		"token": token,
		"user":  user,
	})

	helpers.JSON(w, http.StatusOK, "Login successful", user)
}
