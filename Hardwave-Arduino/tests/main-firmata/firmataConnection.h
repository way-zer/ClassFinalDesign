/**
 * Firmata for Arduino with ESP8266 Shield
 * Used Library: ConfigurableFirmata and WiFiEsp(Hacked) 
 * Made by Way-Zer
 */
#ifndef FirmataConnection_h
#define FirmataConnection_h

#ifndef SERIAL_DEVEL
const char SERVER[] = DEF_SERVER;
#ifndef PORT
#define PORT 9999
#endif
char SSID[] = DEF_SSID;
char PASSWORD[] = DEF_PASSWORD;


// uncomment to enable debugging over Serial (115200 baud)
#define SERIAL_DEBUG 115200
#include "firmataDebug.h"

#include "WiFiEsp.h"
#include <SoftwareSerial.h>
#endif

#include <ConfigurableFirmata.h>
#define IS_IGNORE_PIN(p) ((p) <= 3)

#include <AnalogInputFirmata.h>
AnalogInputFirmata analogInput;
#include <AnalogOutputFirmata.h>
AnalogOutputFirmata analogOutput;
#include <DigitalInputFirmata.h>
DigitalInputFirmata digitalInput;
#include <DigitalOutputFirmata.h>
DigitalOutputFirmata digitalOutput;
#include <Wire.h>
#include <I2CFirmata.h>
I2CFirmata i2c;
#include <FirmataExt.h>
FirmataExt firmataExt;
#include <AnalogWrite.h>
#include <FirmataReporting.h>
FirmataReporting reporting;

void systemResetCallback()
{
  for (byte i = 0; i < TOTAL_PINS; i++)
  {
    if (IS_PIN_ANALOG(i))
    {
      Firmata.setPinMode(i, ANALOG);
    }
    else if (IS_PIN_DIGITAL(i))
    {
      Firmata.setPinMode(i, OUTPUT);
    }
  }
  firmataExt.reset();
}

void initFirmata()
{
  Firmata.setFirmwareVersion(FIRMATA_FIRMWARE_MAJOR_VERSION, FIRMATA_FIRMWARE_MINOR_VERSION);

  firmataExt.addFeature(analogInput);
  firmataExt.addFeature(analogOutput);
  firmataExt.addFeature(digitalInput);
  firmataExt.addFeature(digitalOutput);
  firmataExt.addFeature(i2c);
  firmataExt.addFeature(reporting);

  Firmata.attach(SYSTEM_RESET, systemResetCallback);
#ifdef IS_IGNORE_PIN
  // ignore pins used for WiFi controller or Firmata will overwrite their modes
  for (byte i = 0; i < TOTAL_PINS; i++)
  {
    if (IS_IGNORE_PIN(i))
    {
      Firmata.setPinMode(i, PIN_MODE_IGNORE);
    }
  }
#endif
}

#ifdef SERIAL_DEVEL
void initTransport(){
  Firmata.begin(SERIAL_DEVEL);
}
#else
void printWiFiStatus()
{
  if (WiFi.status() != WL_CONNECTED)
  {
    DEBUG_PRINTS("WiFi connection failed. Status value: ");
    DEBUG_PRINTLN(WiFi.status());
  }
  else
  {
    DEBUG_PRINTLNS("========INFO=========");

    DEBUG_PRINTS("SSID: ");
    DEBUG_PRINTLN(WiFi.SSID());

    DEBUG_PRINTS("Local IP Address: ");
    IPAddress ip = WiFi.localIP();
    DEBUG_PRINTLN(ip);

    DEBUG_PRINTS("Signal strength (RSSI): ");
    long rssi = WiFi.RSSI();
    DEBUG_PRINT(rssi);
    DEBUG_PRINTLNS(" dBm");
    DEBUG_PRINTLNS("========END INFO=======");
  }
}

SoftwareSerial Serial1(2, 3);
void initTransport()
{
  DEBUG_BEGIN(SERIAL_DEBUG);
  Serial1.begin(57600);
  delay(1000);
  //Try to exit Pass-Through 
  Serial1.println("");Serial1.print(F("+++"));
  while(Serial1.available())Serial1.read();
  //Connect to Wifi
  WiFi.init(&Serial1);
  int status = WL_IDLE_STATUS; // the Wifi radio's status
  while (status != WL_CONNECTED)
  {
    delay(500);
    DEBUG_PRINTS("Attempting to connect to WPA SSID: ");
    DEBUG_PRINTLN(SSID);
    // Connect to WPA/WPA2 network
    status = WiFi.begin(SSID, PASSWORD);
  }
  printWiFiStatus();
  //Connect to Server
  status = 0;
  while (!status)
  {
    DEBUG_PRINTLN(F("Start Connect to Server"));
    EspDrv::sendCmd(F("AT+CIPMUX=0"));
    status = EspDrv::sendCmd(F("AT+CIPSTART=\"TCP\",\"%s\",%u"), 5000, SERVER, PORT) == 0;
    if (status)
      DEBUG_PRINTLN(F("Connected to Server"));
  }
  //Start Pass-Through
  status = 0;
  while (!status)
  {
    DEBUG_PRINTLN(F("Start config Pass-Through"));
    EspDrv::sendCmd(F("AT+CIPMODE=1"));
    EspDrv::sendCmd(F("AT+CIPSEND"));
    status = EspDrv::readUntil(1000, ">", false) != -1;
    if (status)
      DEBUG_PRINTLN(F("Config Pass-Through Successfuly"));
  }
  Firmata.begin(Serial1);
}
#endif

void connectionSetup()
{
  pinMode(13,OUTPUT);
  digitalWrite(13,LOW);
  initFirmata();
  initTransport();
  Firmata.parse(SYSTEM_RESET);
  digitalWrite(13,HIGH);
}

void connectionLoop()
{
  digitalInput.report();
  Firmata.processInput();
  if (reporting.elapsed())
  {
    analogInput.report();
    i2c.report();
  }
}

#endif