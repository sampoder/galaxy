/*
 * WebSocketClientSocketIOack.ino
 *
 *  Created on: 20.07.2019
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

float floatMap(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            USE_SERIAL.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

            // join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
        {
            char * sptr = NULL;
            int id = strtol((char *)payload, &sptr, 10);
            USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);
            if(id) {
                payload = (uint8_t *)sptr;
            }
            DynamicJsonDocument doc(1024);
            DeserializationError error = deserializeJson(doc, payload, length);
            if(error) {
                USE_SERIAL.print(F("deserializeJson() failed: "));
                USE_SERIAL.println(error.c_str());
                return;
            }

            String eventName = doc[0];
            USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str());

            // Message Includes a ID for a ACK (callback)
            if(id) {
                // create JSON message for Socket.IO (ack)
                DynamicJsonDocument docOut(1024);
                JsonArray array = docOut.to<JsonArray>();

                // add payload (parameters) for the ack (callback function)
                JsonObject param1 = array.createNestedObject();
                param1["now"] = millis();

                // JSON to String (serializion)
                String output;
                output += id;
                serializeJson(docOut, output);

                // Send event
                socketIO.send(sIOtype_ACK, output);
            }
        }
            break;
        case sIOtype_ACK:
            USE_SERIAL.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            USE_SERIAL.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            USE_SERIAL.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}

void setup() {
    //USE_SERIAL.begin(921600);
    USE_SERIAL.begin(115200);

    pinMode(toggleRepelButton, INPUT);

    pinMode(triggerSplitButton, INPUT);

    analogSetAttenuation(ADC_11db);

    WiFiMulti.addAP("boys on arch", "berkeleyboys");

    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }
    socketIO.begin("6.tcp.ngrok.io", 16907, "/socket.io/?EIO=4");
    socketIO.onEvent(socketIOEvent);
}

unsigned long messageTimestamp = 0;
unsigned long messageTimestamp_1 = 0;
unsigned long messageTimestamp_2 = 0;

bool toggleRepelPressed = false;
bool triggerSplitPressed = false;

void loop() {
    socketIO.loop();

    uint64_t now = millis();

    USE_SERIAL.print(digitalRead(triggerSplitButton));

    USE_SERIAL.print(" ");

    USE_SERIAL.println(digitalRead(toggleRepelButton));

    if(digitalRead(toggleRepelButton) == 1) {
      if(now - messageTimestamp > 500) {
        messageTimestamp = now;
        DynamicJsonDocument doc(1024);
        JsonArray array = doc.to<JsonArray>();
        array.add("toggleRepel");
        JsonObject param1 = array.createNestedObject();
        param1["id"] = (uint32_t) 999;
        String output;
        serializeJson(doc, output);
        socketIO.sendEVENT(output);
        USE_SERIAL.println(output);
      }
    }

    if(digitalRead(triggerSplitButton) == 1) {
      if(now - messageTimestamp_1 > 500) {
        messageTimestamp_1 = now;
        DynamicJsonDocument doc(1024);
        JsonArray array = doc.to<JsonArray>();
        array.add("triggerSplit");
        JsonObject param1 = array.createNestedObject();
        param1["id"] = (uint32_t) 999;
        String output;
        serializeJson(doc, output);
        socketIO.sendEVENT(output);
        USE_SERIAL.println(output);
      }
    }

    int analogValue = analogRead(12);
    float massMultiplier = floatMap(analogValue, 0, 4095, 1, 10);
    USE_SERIAL.println(massMultiplier);

    if(now - messageTimestamp_2 > 500) {
        messageTimestamp_2 = now;
        DynamicJsonDocument doc(1024);
        JsonArray array = doc.to<JsonArray>();
        array.add("updateMass");
        JsonObject param1 = array.createNestedObject();
        param1["id"] = (uint32_t) 999;
        param1["massMultiplier"] = (uint32_t) massMultiplier;
        String output;
        serializeJson(doc, output);
        socketIO.sendEVENT(output);
        USE_SERIAL.println(output);
      }
}
