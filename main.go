package main

import (
	"fmt"
	"gcore_console/cmiddleware"
	"gcore_console/loadconf"
	"gcore_console/server"
	"log"
	"time"

	"gopkg.in/natefinch/lumberjack.v2"
)

func main() {
	// fmt.Println("1")
	loadconf.SetConfig()
	// fmt.Println("2")
	loadconf.LoadServiceInfo()
	// fmt.Println("3")
	cmiddleware.SetKeyBlock()
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.SetOutput(&lumberjack.Logger{
		Filename:   fmt.Sprintf("log/%s.log", time.Now().Format("20060102")),
		MaxSize:    50, // megabytes
		MaxBackups: 3,
		MaxAge:     5, //days
	})
	log.Println("Start api-server..")

	// model.Csdf()
	server.Run()
}
