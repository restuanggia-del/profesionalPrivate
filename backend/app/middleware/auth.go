package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			helpers.JSON(w, http.StatusUnauthorized, "Missing token", nil)
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return helpers.GetJWTSecret(), nil
		})

		if err != nil || !token.Valid {
			helpers.JSON(w, http.StatusUnauthorized, "Invalid token", nil)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			helpers.JSON(w, http.StatusUnauthorized, "Invalid token claims", nil)
			return
		}

		userID := uint(claims["user_id"].(float64))

		ctx := context.WithValue(r.Context(), "user_id", userID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
