package model

import (
	"encoding/json"
	"gcore_console/loadconf"
	"gcore_console/shared/gcoreapi"
	"log"
)

func GETAccessToken() {
	//access token GET
	respBody, err := gcoreapi.Request(nil, "iam/auth/reselling/auth_settings", "GET", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
	}

	log.Println(string(respBody))
}
func PUTAccessToken() {
	type requestBlock struct {
		JWT_TTL int `json:"jwt_ttl"`
	}
	tokenTime := &requestBlock{
		JWT_TTL: 1800,
	}
	reqJSON, err := json.Marshal(*tokenTime)
	if err != nil {
		log.Println(err)
	}
	//access token GET
	respBody, err := gcoreapi.Request(reqJSON, "iam/auth/reselling/auth_settings", "PUT", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
	}

	log.Println(string(respBody))
}
