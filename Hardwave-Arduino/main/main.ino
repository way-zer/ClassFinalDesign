// #define SERIAL_DEVEL 57600

#define DEF_SERVER "10.122.254.204"
#define PORT 9999
#define DEF_SSID "1048203787-NB"
#define DEF_PASSWORD "789456123"

#define Pin_Main_Servo 6
#define Pin_Servo_Checker 12
//----------

#include "firmataConnection.h"
#include "servoFeature.h"

#include "Tasker.h"
Tasker tasker;
extern FirmataExt firmataExt;
extern ServoFeature servoFeature;

boolean servo_doing;
unsigned int resetTestTime=0;


void setup(){
  firmataExt.addFeature(servoFeature);
  connectionSetup();
}

void loop(){
  connectionLoop();
  tasker.loop();
}