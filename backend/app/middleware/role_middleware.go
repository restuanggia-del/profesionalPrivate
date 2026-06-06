package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

func RoleMiddleware(allowedRole string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			authHeader := r.Header.Get("Authorization")
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

			role, ok := claims["role"].(string)
			if !ok || role != allowedRole {
				helpers.JSON(w, http.StatusForbidden, "Access denied", nil)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
