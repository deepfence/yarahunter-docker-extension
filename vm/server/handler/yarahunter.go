package handler

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"yarahunter-extension/server"

	"github.com/labstack/echo"
	"github.com/sirupsen/logrus"
)

func YaraHunterScanHandler(ctx echo.Context) error {
	logrus.Infof("starting to scan")
	yhReq := new(server.YaraHunterScanRequest)
	if err := ctx.Bind(yhReq); err != nil {
		return err
	}
	logrus.Infof("L0: scan requested for: %s", yhReq.ImageName)
	postBody, _ := json.Marshal(map[string]string{
		"image_name_with_tag": yhReq.ImageName,
	})
	response, err := http.Post(server.YARAHUNTER_API_URL, "application/json", bytes.NewBuffer(postBody))
	if err != nil {
		logrus.Errorf("An Error Occured %v", err)
		return ctx.JSON(http.StatusBadRequest, server.HTTPMessageBody{Message: err.Error()})
	}

	defer response.Body.Close()

	//Read the response body
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatalln(err)
	}
	sb := string(body)
	return ctx.JSON(http.StatusOK, server.HTTPMessageBody{Message: sb})
}
