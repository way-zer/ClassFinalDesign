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
    stepper.setSpeed(6);
    stepper.step(2048);
    stepperStop();
}

void loop()
{
    loopConnection();
}

void stepperStop(){
    digitalWrite(4, LOW);
    digitalWrite(5, LOW);
    digitalWrite(6, LOW);
    digitalWrite(7, LOW);
}

// cmd通道协议说明
// payload[0] 表示类型
//控制主舵机 payload[1]表示格位(1-8)
#define CMD_MAIN_SERVO 'a'
//主舵机微调 payload[1]表示step(0-255) 执行后currentPos=0
#define CMD_MAIN_RESET 'b'
//开启主光电门检测
#define CMD_START_CHECK 'c'
//关闭主光电门检测
#define CMD_END_CHECK 'd'

// info通道协议说明
// payload[0] 表示类型

// 光电门触发开始
#define INFO_CHECK_START 'A'
// 光电门触发结束
#define INFO_CHECK_END 'B'
// 非法闯入警告
#define INFO_CHECK_WARN 'C'
#define INFO_PONG '1'

int currentPos = 0;
#define abs(x) (x < 0 ? (-x) : x)
void mqttCallback(char topic[], byte *payload, unsigned int length)
{
    if (topic[0] == 'c' && topic[1] == 'm')
    { //cmd
        Serial.print(F("Recived Msg:"));
        Serial.print(topic);
        Serial.println((char)payload[0]);
        if ((char)payload[0] == CMD_MAIN_SERVO)
        {
            int num = (char)payload[1] - '1';
            Serial.print(F("[Servo]Move to "));
            Serial.println(num);
            for (int i = 5; i <= 12; i++)
                if ((currentPos + i) % 8 == num)
                    stepper.step(256 * (i-8));
            stepperStop();
            currentPos = num;
        }else if((char)payload[0] == CMD_MAIN_RESET){
            stepper.step(payload[1]);
            currentPos = 0;
            stepperStop();
        }
        sendInfo(INFO_PONG);
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