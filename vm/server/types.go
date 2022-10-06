package server

type HTTPMessageBody struct {
	Message string
}

type YaraHunterScanRequest struct {
	ImageName string `json:"image_name"`
}
