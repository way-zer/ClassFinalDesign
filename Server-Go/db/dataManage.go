package db

import (
	"github.com/HouzuoGuo/tiedot/db"
	"github.com/HouzuoGuo/tiedot/dberr"
	"time"
)

type User struct {
	id int
	Name string
	OpenId string
	CardId int
}

type CardInfo struct {
	id int
	Title string
	Date time.Time
	User User
}

var myDB *db.DB
func Start(dbDir string)  {
	myDB,_ = db.OpenDB(dbDir)
}

func GetInfo(page int) []CardInfo  {
	query := map[string]interface{}{

	}
}

func getUserInfo(openid string) User {

}

func AddOrUpdateInfo(info CardInfo)  {

}

func Close()  {
	myDB.Close()
}
