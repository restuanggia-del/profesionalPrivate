package helpers

import (
	"fmt"
	"time"

	"github.com/jung-kurt/gofpdf"
)

func GenerateCertificatePDF(studentName, courseTitle string) string {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	pdf.SetFont("Arial", "B", 24)
	pdf.Cell(0, 20, "CERTIFICATE OF COMPLETION")
	pdf.Ln(20)

	pdf.SetFont("Arial", "", 16)
	pdf.Cell(0, 12, "This certifies that")
	pdf.Ln(12)

	pdf.SetFont("Arial", "B", 20)
	pdf.Cell(0, 15, studentName)
	pdf.Ln(15)

	pdf.SetFont("Arial", "", 16)
	pdf.Cell(0, 12, "has successfully completed")
	pdf.Ln(12)

	pdf.SetFont("Arial", "B", 18)
	pdf.Cell(0, 14, courseTitle)
	pdf.Ln(20)

	pdf.SetFont("Arial", "", 12)
	pdf.Cell(0, 10, time.Now().Format("02 January 2006"))

	path := fmt.Sprintf("storage/certificates/%d.pdf", time.Now().Unix())
	pdf.OutputFileAndClose(path)

	return path
}
