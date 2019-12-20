#define WIFI_SSID "1048203787-NB"
#define WIFI_PASSWORD "789456123"

#define MQTT_SERVER IPAddress(183, 230, 40, 39)
#define MQTT_PORT 6002
#define MQTT_clientId "577841491"
#define MQTT_username "302971"
#define MQTT_password "develop"

#include "./connection.h"

#include "Stepper.h"
Stepper stepper(2048, 4, 5, 6, 7);

extern Tasker tasker;

extern PubSubClient client;
void setup()
{
    Serial.begin(115200);
    client.setCallback(mqttCallback);
    initConnection();
    stepper.setSpeed(8);
    stepper.step(256);
    digitalWrite(4, LOW);
    digitalWrite(5, LOW);
    digitalWrite(6, LOW);
    digitalWrite(7, LOW);
}

void loop()
{
    loopConnection();
}

// cmd通道协议说明
// payload[0] 表示类型
//控制主舵机 payload[1]表示格位(1-8)
#define CMD_MAIN_SERVO 0x02
//主舵机微调 payload[1]表示step(0-255) 执行后currentPos=0
#define CMD_MAIN_RESET 0x1
//开启主光电门检测
#define CMD_START_CHECK 0x04
//关闭主光电门检测
#define CMD_END_CHECK 0x06

// info通道协议说明
// payload[0] 表示类型

// 光电门触发开始
#define INFO_CHECK_START 0x02
// 光电门触发结束
#define INFO_CHECK_END 0x04
// 非法闯入警告
#define INFO_CHECK_WARN 0x06
#define INFO_PONG 0x31

int currentPos = 0;
#define abs(x) (x < 0 ? (-x) : x)
void mqttCallback(char topic[], byte *payload, unsigned int length)
{
    if (topic[0] == 'c' && topic[1] == 'm')
    { //cmd
        Serial.print(F("Recived Msg:"));
        Serial.print(topic);
        Serial.println(payload[0], HEX);
        sendInfo(INFO_PONG);
        if (payload[0] == CMD_MAIN_SERVO)
        {
            int num = payload[1] - 1;
            sendInfo(INFO_PONG);
            for (int i = -3; i <= 4; i++)
                if ((currentPos + i) % 8 == num)
                    stepper.step(256 * i);
        }else if(payload[0] == CMD_MAIN_RESET){
            stepper.step(payload[1]);
        }
    }
}

byte payload[1];
void sendInfo(byte info)
{
    Serial.print(F("Send Msg:"));
    Serial.println(info, HEX);
    payload[0] = info;
    client.publish("info", payload, 1);
}