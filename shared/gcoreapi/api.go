package gcoreapi

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"errors"
	"fmt"
	"gcore_console/loadconf"
	"io"
	"log"
	"net/http"
)

type ErrorResponse struct {
	Errors map[string]string `json:"errors"`
}
type ErrorResponse2 struct {
	Errors interface{} `json:"errors"`
}

// Request : Gcore API
func Request(reqJSON []byte, urlpath, method, token string) ([]byte, error) {
	url := fmt.Sprintf("https://api.gcore.com/%s", urlpath)
	var payload *bytes.Buffer
	m := make(map[string]interface{})
	if len(reqJSON) != 0 {
		err := json.Unmarshal(reqJSON, &m)
		if err != nil {
			log.Println(err)
			return nil, err
		}
	}
	payload = bytes.NewBuffer(reqJSON)

	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}
	// client := &http.Client{}
	log.Printf("[%s] Request >> %s %s \n", method, url, string(reqJSON))
	req, err := http.NewRequest(method, url, payload)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Connection", "close")
	req.Header.Add("Authorization", fmt.Sprintf("Bearer %s", token))

	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return nil, errors.New("[waf v2 api] server error")
	}
	defer resp.Body.Close()

	//인증 만료 시, 토큰 새로 발급받고 재귀함수 호출.
	if resp.StatusCode == 401 {
		log.Println("[Token ERROR] >> GET Token Start")
		loadconf.LoadServiceInfo()
		return Request(reqJSON, urlpath, method, loadconf.TOTKENINFO.Access)
	}
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("%s %s >>> %s\n", method, url, err)
		return nil, err
	}

	if resp.StatusCode > 204 {
		log.Printf("%s %s >>> [ERROR : %d] %s \n", method, url, resp.StatusCode, string(respBody))
		var errMsg string

		if resp.StatusCode == 404 {
			errMsg = "404 Not Found"
			return nil, errors.New(errMsg)
		}
		var errResp ErrorResponse
		err = json.Unmarshal(respBody, &errResp)
		if err != nil {
			errMsg = "Parsing fail"
			log.Println(err)
		}
		if errResp.Errors != nil {
			log.Println(errResp.Errors)
		}

		// 에러 메시지 추출
		for i, msgs := range errResp.Errors {
			errMsg = msgs // 첫 번째 에러 메시지만 선택
			log.Printf("[ERROR : %s] %s \n", i, msgs)
			break
		}
		// var errResp2 ErrorResponse2
		// err = json.Unmarshal(respBody, &errResp2)
		// if err != nil {
		// 	errMsg = "Parsing fail"
		// }

		// if errResp2.Errors != nil {
		// 	log.Println(errResp2.Errors)
		// }

		if errMsg == "" {
			errMsg = "Unknown error"
		}

		return nil, errors.New(errMsg)
	}
	return respBody, nil
}