/*
 *  GalaxyController.ino
 *
 *  Author: @sampoder
 *
 *  Purpose: this file handles the logic of button presses and the potentiometer dial and mapping these events
 *  to their associated websocket event.
 *
 */

#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

WiFiMulti WiFiMulti;
SocketIOclient socketIO;

#define USE_SERIAL Serial

int toggleRepelButton = 21;
int triggerSplitButton = 15;
int massPotentiometer = 12;

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    if (type == sIOtype_CONNECT) {
      socketIO.send(sIOtype_CONNECT, "/"); // join default namespace (no auto join in Socket.IO V3)
    }
}

void setup() {
    USE_SERIAL.begin(115200);

    pinMode(toggleRepelButton, INPUT);
    pinMode(triggerSplitButton, INPUT);
    pinMode(massPotentiometer, INPUT);

    analogSetAttenuation(ADC_11db); // needed because we're taking analog input 

    // connect to WiFi to communicate with the server
  
    WiFiMulti.addAP("SSID", "PASSWORD");

    while(WiFiMulti.run() != WL_CONNECTED) { // retry connections
        delay(100);
    }
    socketIO.begin("6.tcp.ngrok.io", 16907, "/socket.io/?EIO=4"); // this URL may vary

    socketIO.onEvent(socketIOEvent);
}

// these timestamps will be used to throttle clicks, we don't want to oversend messages
// when someone is holding down a button

unsigned long messageTimestamp_toggleRepel = 0;
unsigned long messageTimestamp_triggerSplit = 0;
unsigned long messageTimestamp_mass = 0;

void loop() {
    socketIO.loop();

    uint64_t now = millis(); // timestamp to compare

    if(digitalRead(toggleRepelButton) == 1) {
      if(now - messageTimestamp_toggleRepel > 500) {
        messageTimestamp_toggleRepel = now;
        DynamicJsonDocument doc(1024);
        JsonArray array = doc.to<JsonArray>();
        array.add("toggleRepel"); // this is the event name
        JsonObject param1 = array.createNestedObject(); // this is the parameters to pass in to the event
        param1["id"] = (uint32_t) 999; // 999 is our special ID for the physical controller's particle
        String output;
        serializeJson(doc, output);
        socketIO.sendEVENT(output);
      }
    }

    if(digitalRead(triggerSplitButton) == 1) {
      if(now - messageTimestamp_triggerSplit > 500) {
        messageTimestamp_triggerSplit = now;
        DynamicJsonDocument doc(1024);
        JsonArray array = doc.to<JsonArray>();
        array.add("triggerSplit");
        JsonObject param1 = array.createNestedObject();
        param1["id"] = (uint32_t) 999;
        String output;
        serializeJson(doc, output);
        socketIO.sendEVENT(output);
      }
    }

    int analogValue = analogRead(massPotentiometer);
    int massMultiplier = map(analogValue, 0, 4095, 1, 10);

    // we do this at any time because there's no harm
    // in re-sending the same value
    
    if(now - messageTimestamp_mass > 500) {
      messageTimestamp_mass = now;
      DynamicJsonDocument doc(1024);
      JsonArray array = doc.to<JsonArray>();
      array.add("updateMass");
      JsonObject param1 = array.createNestedObject();
      param1["id"] = (uint32_t) 999;
      param1["massMultiplier"] = (uint32_t) massMultiplier;
      String output;
      serializeJson(doc, output);
      socketIO.sendEVENT(output);
    }
}
