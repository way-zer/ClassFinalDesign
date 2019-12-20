#ifndef FIRMATA_DEBUG_H
#define FIRMATA_DEBUG_H

#ifdef SERIAL_DEBUG
  #define DEBUG_BEGIN(baud) Serial.begin(baud); while(!Serial) {;}
  #define DEBUG_PRINTLN(x)  Serial.println (x)
  #define DEBUG_PRINT(x)    Serial.print (x)
  #define DEBUG_PRINTLNS(x)  Serial.println (F(x))
  #define DEBUG_PRINTS(x)    Serial.print (F(x))
#else
  #define DEBUG_BEGIN(baud)
  #define DEBUG_PRINTLN(x)
  #define DEBUG_PRINT(x)
  #define DEBUG_PRINTLNS(x)
  #define DEBUG_PRINTS(x)
#endif

#endif /* FIRMATA_DEBUG_H */
