package session

import (
	"fmt"
	"gcore_console/loadconf"
	"io/ioutil"
	"log"
	"os"
	"time"
)

var cutOff = 1 * time.Hour
var sessionDir = ""

func Clear() {
	sessionDir = fmt.Sprintf("%s/resource/sessions", loadconf.AIROOTDIR)
	_, err := os.Stat(sessionDir)
	if os.IsNotExist(err) {
		err = os.Mkdir(sessionDir, 0755)
		if err != nil {
			log.Println(err)
		}
	}
	ticker := time.NewTicker(time.Minute * 15)
	log.Println("Start Session Clear Routine")

	for range ticker.C {
		log.Println("session clear start")
		fileInfo, err := ioutil.ReadDir(sessionDir)
		if err != nil {
			log.Fatal(err.Error())
		}

		now := time.Now()
		for _, info := range fileInfo {
			if diff := now.Sub(info.ModTime()); diff > cutOff {
				log.Printf("session data cleared[%s]\n", info.Name())
				err := os.Remove(sessionDir + info.Name())
				if err != nil {
					log.Println(err)
					continue
				}
			}
		}
	}
}

// 기존 로그인되어있던 세션 삭제
func SessionDelete(deletefile string) {
	_, err := os.Stat(sessionDir)
	if os.IsNotExist(err) {
		err = os.Mkdir(sessionDir, 0755)
		if err != nil {
			log.Println(err)
		}
	}
	fileInfo, err := ioutil.ReadDir(sessionDir)
	if err != nil {
		log.Fatal(err.Error())
	}

	for _, info := range fileInfo {
		if info.Name() == deletefile {
			err := os.Remove(sessionDir + "/" + info.Name())
			if err != nil {
				log.Println(err)
				continue
			}
			return
		}
	}
}
