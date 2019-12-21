// #define MQTT_MAX_PACKET_SIZE 256
// #define MQTT_KEEPALIVE 900 
#include <WiFiEspClient.h>
#include <WiFiEsp.h>
#include <PubSubClient.h>
#include "SoftwareSerial.h"
#include "Tasker.h"

#if defined(MQTT_SERVER) && defined(WIFI_SSID) && defined(WIFI_PASSWORD)\
    &&defined(MQTT_clientId) && defined(MQTT_username) && defined(MQTT_password)

WiFiEspClient espClient;
PubSubClient client(espClient);
SoftwareSerial soft(2, 3);
int status = WL_IDLE_STATUS;
Tasker tasker;

boolean waitingConnection = false;
//private
void reconnectWifi()
{
    status = WiFi.status();
    if(status == WL_CONNECTED)return;
    Serial.print(F("[InitWiFi]Attempting to connect to WPA SSID: "));
    Serial.println(F(WIFI_SSID));
    // Connect to WPA/WPA2 network
    status = WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}
//private
void reconnectMQTT()
{
    if(client.connected())return;
    if (client.connect(MQTT_clientId, MQTT_username, MQTT_password))
    {
        Serial.println(F("[MQTT]DONE"));
        client.subscribe("cmd",1);
    }
    else
    {
        Serial.print(F("[FAILED] [ mqtt connect error code = "));
        Serial.print(client.state());
        Serial.println(F(" : retrying in 3 seconds]")); // Wait 5 seconds before retrying
    }
}

//初始化函数 setup()调用
void initConnection()
{
    soft.begin(9600);
    WiFi.init(&soft);
    client.setServer(MQTT_SERVER, MQTT_PORT);
    tasker.setInterval(reconnectWifi,500);
    tasker.setInterval(reconnectMQTT,3000);
}

//循环检测函数 loop()调用
void loopConnection()
{
    tasker.loop();
    client.loop();
}
#else
#error("缺少参数")
#endif