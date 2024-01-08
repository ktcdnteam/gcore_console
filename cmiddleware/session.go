package cmiddleware

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"time"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo/v4"
)

var Store *sessions.FilesystemStore

type AdminInfoBlock struct {
	Partner string `json:"partner"`
	Email   string `json:"name"`
	Key     string `json:"key"`
}

// SetKeyBlock : SIGUSR2 발생 시 Key 불러오기
func SetKeyBlock() {
	var keyInfoMap = make(map[string][]byte)
	fileBody, err := ioutil.ReadFile("resource/key/keyinfo.key")
	if err != nil || fileBody == nil {
		log.Println("Cannot find file : keyinfo.key")
		os.Exit(1)
	}
	json.Unmarshal(fileBody, &keyInfoMap)
	// 세션 저장소 인스턴스 생성
	Store = sessions.NewFilesystemStore("resource/sessions", keyInfoMap["hashkey"], keyInfoMap["blockkey"])

}

// SetSessionID : 새로운 세션 생성
func SetSessionID(c echo.Context, data *AdminInfoBlock) string {
	session, _ := Store.Get(c.Request(), "admin_session")

	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   86400,
		HttpOnly: true,
		Secure:   true,
	}

	session.Values["ctime"] = time.Now().Unix()
	session.Values["partner"] = data.Partner
	session.Values["email"] = data.Email
	session.Values["key"] = data.Key

	session.Save(c.Request(), c.Response())

	return fmt.Sprintf("session_%s", session.ID)
}

// CheckSessionID : 세션 체크
func (c *CustomContext) CheckSessionID() (ok bool) {
	session, _ := Store.Get(c.Request(), "admin_session")
	if oldTime, exists := session.Values["ctime"]; exists {
		nowTime := time.Now().Unix()
		diffTime := nowTime - oldTime.(int64)

		if diffTime > 3600 {
			c.ClearSessionID()
			ok = false
		} else {
			info := SaveSessionInfo(session)
			SetSessionID(c, &info)
			ok = true
		}
	} else {
		c.ClearSessionID()
	}

	return ok
}

// SaveSessionInfo :SaveSessionInfo
func SaveSessionInfo(session *sessions.Session) (info AdminInfoBlock) {
	info.Partner, _ = session.Values["partner"].(string)
	info.Email, _ = session.Values["email"].(string)
	info.Key, _ = session.Values["key"].(string)

	return info
}

// ClearSessionID : 세션 삭제
// 서버, 브라우저에서 모두 지워짐
func (c *CustomContext) ClearSessionID() {
	session, _ := Store.Get(c.Request(), "admin_session")
	session.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
	}

	session.Save(c.Request(), c.Response())
}

// CheckAdminSession : adminpage session check
func (c *CustomContext) CheckAdminSession() (info AdminInfoBlock) {
	session, err := Store.Get(c.Request(), "admin_session")
	if err != nil {
		log.Println(err)
	}
	info = SaveSessionInfo(session)

	return info
}
