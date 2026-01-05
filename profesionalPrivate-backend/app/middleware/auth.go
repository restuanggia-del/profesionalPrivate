package middleware

import (
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

		next.ServeHTTP(w, r)
	})
}
