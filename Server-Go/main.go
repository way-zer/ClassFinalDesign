package main

import (
	"wayzer.cf/mybot/db"
	"wayzer.cf/mybot/tcpServer"
	"wayzer.cf/mybot/webServer"
)

func main() {
	go db.Start("./data")
	go tcpServer.Start(8089)
	go webServer.Start(8088)
}


