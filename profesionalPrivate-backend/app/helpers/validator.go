package helpers

import "strings"

func IsEmpty(value string) bool {
	return strings.TrimSpace(value) == ""
}

func MinLength(value string, min int) bool {
	return len(strings.TrimSpace(value)) >= min
}

func IsValidRole(role string) bool {
	return role == "admin" || role == "teacher" || role == "student"
}
