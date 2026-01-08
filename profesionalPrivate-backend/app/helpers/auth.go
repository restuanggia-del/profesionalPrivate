package helpers

import (
	"net/http"
)

func GetUserID(r *http.Request) uint {
	userID, ok := r.Context().Value("user_id").(uint)
	if !ok {
		return 0
	}
	return userID
}
