package server

import (
	"gcore_console/route"
	"log"
)

func Run() {
	log.Println("Start api-server..")

	e := route.Route()
	e.Logger.Fatal(e.Start(":80"))
}
