/**
 * 该文件用来修改Wifi模块的波特率等
 * 修改波特率指令: AT+UART_DEF=57600,8,1,0,0
 * 
 * 下面define修改为当前波特率(默认115200,常用9600)
 */
#define SerialUrt 57600

/****************** WIFI ******************************/
#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3);  // 对于Core必须使用软串口进行WIFI模块通信
#define esp8266Serial mySerial   // 定义WIFI模块通信串口

char serialbuffer[1000];  //url储存
String dataToSend;  //AT指令储存
String startcommand;
String sendcommand;
String dataToRead=""; //指令读取
/****************** WIFI done**************************/

void setup()
{
  Serial.begin(115200);//rial debug
  esp8266Serial.begin(SerialUrt);//connection to ESP8266
  esp8266Init();
}

void loop()
{
  if(Serial.available() > 0){
    dataToSend = Serial.readStringUntil('\n');
    Serial.println("CMD:"+dataToSend);
    esp8266Serial.println(dataToSend); 
    dataToSend = "";
  }

  if(esp8266Serial.available() > 0) {
    dataToRead = esp8266Serial.readStringUntil('\n');
    Serial.println(dataToRead);
    dataToRead = "";
  }
}

void esp8266Init() {
  esp8266Serial.println("AT");
  delay(500);
  esp8266Serial.println("AT+RST");
  delay(500);
  Serial.println("SETUP FINISHED!WELCOME! Fixed by: YK");
}