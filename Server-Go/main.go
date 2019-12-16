package main

import (
	"fmt"
	"net"
	"os"
	"time"

	"gobot.io/x/gobot"
	"gobot.io/x/gobot/drivers/gpio"
	"gobot.io/x/gobot/platforms/firmata"
)

const (
	Serve = true
)

func main() {
	if !Serve {
		mybot(firmata.NewAdaptor("COM3"))
		os.Exit(0)
	}
	ln, err := net.Listen("tcp4", "0.0.0.0:9999")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ln.Close()
	fmt.Println("Listening on 9999")
	for {
		c, _ := ln.Accept()
		fmt.Print("Recive Connection: ")
		fmt.Println(c)
		go func(con net.Conn) {
			defer con.Close()
			firmataAdaptor := firmata.NewAdaptor(con.RemoteAddr().String(), con)
			mybot(firmataAdaptor)
		}(c)
	}
}

func mybot(firmataAdaptor *firmata.Adaptor) {
	// firmataAdaptor := firmata.NewAdaptor("COM3")
	led := gpio.NewLedDriver(firmataAdaptor, "13")
	mainServo := gpio.NewServoDriver(firmataAdaptor, "3")

	work := func() {
		gobot.Every(1*time.Second, func() {
			led.Toggle()
		})
		gobot.After(1*time.Second, func() {
			mainServo.Move(180)
		})
	}

	robot := gobot.NewRobot("bot",
		[]gobot.Connection{firmataAdaptor},
		[]gobot.Device{led, mainServo},
		work,
	)

	robot.Start()
}
