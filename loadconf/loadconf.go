package loadconf

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

// AIROOTDIR is Root directory
var AIROOTDIR string

// Config
var (
	KTCLOUD_DB_IP   string
	KTCLOUD_DB_PORT string
	KTCLOUD_DB_USER string
	KTCLOUD_DB_PWD  string
	AKAMAI_API_URL  string
)

type TokenBlcok struct {
	Refresh string `json:"refresh"`
	Access  string `json:"access"`
}
type LoginBlock struct {
	Username        string `json:"username"`
	Password        string `json:"password"`
	OneTimePassword string `json:"one_time_password"`
}

var TOTKENINFO *TokenBlcok

// var PRODUCTINFO map[string]bool
var PRODUCTINFO []string
var APIINFO []string

func LoadServiceInfo() {

	loginInfo := &LoginBlock{
		Username: "dlek55@naver.com",
		// Username:        "cdntech.ktcloud@kt.com",
		Password:        "number1Cloud!2#",
		OneTimePassword: "",
	}
	reqJSON, err := json.Marshal(*loginInfo)
	if err != nil {
		log.Println(err)
		return
	}

	var payload *bytes.Buffer
	m := make(map[string]interface{})
	if len(reqJSON) != 0 {
		err := json.Unmarshal(reqJSON, &m)
		if err != nil {
			log.Println(err)
		}
	}
	payload = bytes.NewBuffer(reqJSON)

	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	// client := &http.Client{}
	log.Printf("[POST] NEW TOKEN >> %s \n", string(reqJSON))
	req, err := http.NewRequest("POST", "https://api.gcore.com/iam/auth/jwt/login", payload)
	if err != nil {
		log.Println(err)
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Connection", "close")

	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println(err)
	}

	err = json.Unmarshal(respBody, &TOTKENINFO)
	if err != nil {
		log.Println(err)
		return
	}

}

// SetConfig :
func SetConfig() {
	// if AIROOTDIR = os.Getenv("AIROOTDIR"); AIROOTDIR == "" {
	// 	log.Println("[ERR] Please check your environment variables. [AIROOTDIR]")
	// 	os.Exit(1)
	// }

	// if KTCLOUD_DB_IP = os.Getenv("KTCLOUD_DB_IP"); KTCLOUD_DB_IP == "" {
	// 	log.Println("[ERR] Please check your environment variables. [KTCLOUD_DB_IP]")
	// 	os.Exit(1)
	// }

	// if KTCLOUD_DB_PORT = os.Getenv("KTCLOUD_DB_PORT"); KTCLOUD_DB_PORT == "" {
	// 	log.Println("[ERR] Please check your environment variables. [KTCLOUD_DB_PORT]")
	// 	os.Exit(1)
	// }

	// if KTCLOUD_DB_PWD = os.Getenv("KTCLOUD_DB_PWD"); KTCLOUD_DB_PWD == "" {
	// 	log.Println("[ERR] Please check your environment variables. [KTCLOUD_DB_PWD]")
	// 	os.Exit(1)
	// }

	// if KTCLOUD_DB_USER = os.Getenv("KTCLOUD_DB_USER"); KTCLOUD_DB_USER == "" {
	// 	log.Println("[ERR] Please check your environment variables. [KTCLOUD_DB_USER]")
	// 	os.Exit(1)
	// }

	// if AKAMAI_API_URL = os.Getenv("AKAMAI_API_URL"); AKAMAI_API_URL == "" {
	// 	log.Println("[ERR] Please check your environment variables. [AKAMAI_API_URL]")
	// 	os.Exit(1)
	// }

	AIROOTDIR = "~/go/src/ktcloudcdn.com/gcore_console"
	KTCLOUD_DB_IP = ""
	KTCLOUD_DB_PORT = ""
	KTCLOUD_DB_USER = ""
	KTCLOUD_DB_PWD = ""
	AKAMAI_API_URL = ""
}
