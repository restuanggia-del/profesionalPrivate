package helpers

import (
	"encoding/json"
	"net/http"
)

func ParseJSON(r *http.Request, dst interface{}) error {
	return json.NewDecoder(r.Body).Decode(dst)
}
