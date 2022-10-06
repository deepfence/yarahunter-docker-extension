package server

import (
	"net"
	"net/http"

	"github.com/labstack/echo"
)

func PingHandler(ctx echo.Context) error {
	return ctx.JSON(http.StatusOK, HTTPMessageBody{Message: "pong"})
}

func Listen(path string) (net.Listener, error) {
	return net.Listen("unix", path)
}
