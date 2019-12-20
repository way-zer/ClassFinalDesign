package tcpServer

import (
	"fmt"
	"gobot.io/x/gobot"
	"gobot.io/x/gobot/drivers/gpio"
	"gobot.io/x/gobot/platforms/firmata"
	"net"
	"strconv"
	"time"
)

func Start(port int){
	ln, err := net.Listen("tcp4", "0.0.0.0:"+strconv.Itoa(port))
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ln.Close()
	fmt.Println("Listening on %s", port)
	for {
		c, _ := ln.Accept()
		fmt.Print("Recive Connection: ")
		fmt.Println(c)
		go func(con net.Conn) {
			defer con.Close()
			firmataAdaptor := firmata.NewAdaptor(con.RemoteAddr().String(), con)
			myBot(firmataAdaptor)
		}(c)
	}
}

func Close() {

}

func myBot(firmataAdaptor *firmata.Adaptor) {
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
