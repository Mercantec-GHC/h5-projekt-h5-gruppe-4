#include <ArduinoJson.h>

void handleMessage(String jsonStr);

// Buffer til indkommende data
String buffer = "";

// Event-timere
unsigned long lastTempTime = 0;

// Pin til knap-event
const int buttonPin = 2;

void setup() {
  Serial.begin(9600);
  pinMode(buttonPin, INPUT_PULLUP);
}

void loop() {
  // Ikke-blokerende læsning af USB-serial
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') {
      handleMessage(buffer);
      buffer = "";
    } else {
      buffer += c;
    }
  }

  // Event: knap trykket
  static int lastState = HIGH;
  int state = digitalRead(buttonPin);
  if (state != lastState) {
    lastState = state;

    StaticJsonDocument<128> eventDoc;
    eventDoc["event"] = "buttonPressed";
    eventDoc["data"]["pin"] = buttonPin;
    eventDoc["data"]["state"] = state;

    String out;
    serializeJson(eventDoc, out);
    Serial.println(out);
  }

  // Event: temperatur hvert 2. sekund
  if (millis() - lastTempTime > 2000) {
    lastTempTime = millis();

    float fakeTemp = 22.5 + (millis() % 1000) / 100.0; // Demo-temp

    StaticJsonDocument<128> eventDoc;
    eventDoc["event"] = "tempUpdate";
    eventDoc["data"]["temp"] = fakeTemp;

    String out;
    serializeJson(eventDoc, out);
    Serial.println(out);
  }
}

// Håndterer JSON-requests fra browseren
void handleMessage(String jsonStr) {
  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, jsonStr);

  if (err) {
    Serial.println("{\"error\":\"invalid_json\"}");
    return;
  }

  const char* cmd = doc["cmd"];
  int id = doc["id"] | -1;

  // --- Kommando: ping ---
  if (strcmp(cmd, "ping") == 0) {
    StaticJsonDocument<128> reply;
    reply["id"] = id;
    reply["data"]["pong"] = true;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
    return;
  }

  // --- Kommando: getTemp ---
  if (strcmp(cmd, "getTemp") == 0) {
    float fakeTemp = 23.7;

    StaticJsonDocument<128> reply;
    reply["id"] = id;
    reply["data"]["temp"] = fakeTemp;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
    return;
  }

  // Ukendt kommando
  StaticJsonDocument<128> reply;
  reply["id"] = id;
  reply["error"] = "unknown_command";

  String out;
  serializeJson(reply, out);
  Serial.println(out);
}