package webServer

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

const(
	NORMAL = "正常"
	NOTFOUND = "丢失未找到"
	FOUND = "已找到"
)

type InfoCard struct{
	Key int `json:"key"`
	Name string `json:"name"`
	CardId int `json:"card"`
	Time string `json:"time"`
	Status string `json:"status"`

}

const MOCK = true

/**
 * 获取首页挂失信息
 * 返回Promise<数据数组>
 */
func getInfos(c *gin.Context){
	_: c.Param("page")
	c.JSON(http.StatusOK,[]InfoCard{
		{1,"用户1",2019210104,"12-22 12:30",NOTFOUND},
		{2,"用户2",2019210105,"12-22 17:30",FOUND},
	})
}
/**
 * 获取用户当前信息
 * 挂失页面所需数据，reject如果不存在
 * 返回Promise
 */
func getInfoOrLogin(openid string){
}
/**
 * 完善用户信息
 * 参数为 微信用户信息对象 名字 卡号
 * 返回Promise
 */
func completeInfo(user,name,id){
}
/**
 * 报告捡到卡
 * 硬件端将有所动作
 * 返回Promise
 */
func reportFound(name, id) {
}
/**
 * 挂失
 * 挂失前必须完善信息，并给予用户具体说明
 * 该函数将请求服务通知
 * 返回Promise
 */
func reportLoss(){
}
/**
 * 请求取卡
 * 要求当前卡状态为找到
 * 硬件端将配合
 * 返回Promise
 */
func requestCard(){
}

func Start(port int){
	r := gin.Default()
	r.GET("/info",getInfos)
	_ = r.Run(":" + strconv.Itoa(port))
}
