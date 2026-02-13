package middleware

import (
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/restuanggia/profesionalPrivate/app/helpers"
)

func PermissionMiddleware(requiredPermission string) mux.MiddlewareFunc {
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

			claims := token.Claims.(jwt.MapClaims)

			permissions, ok := claims["permissions"].([]interface{})
			if !ok {
				helpers.JSON(w, http.StatusForbidden, "No permissions found", nil)
				return
			}

			hasPermission := false
			for _, p := range permissions {
				if p.(string) == requiredPermission {
					hasPermission = true
					break
				}
			}

			if !hasPermission {
				helpers.JSON(w, http.StatusForbidden, "Permission denied", nil)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
