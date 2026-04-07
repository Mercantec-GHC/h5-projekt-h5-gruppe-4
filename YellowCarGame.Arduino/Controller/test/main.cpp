#include <ArduinoJson.h>
#include <Arduino_MKRIoTCarrier.h>

MKRIoTCarrier carrier;

void handleMessage(String jsonStr);

// Buffer til indkommende data
String buffer = "";

// Event-timere
unsigned long lastTempTime = 0;

// Pin til knap-event
// const int buttonPin = 2;

static bool btnState1 = false;
static bool btnState2 = false;
static bool btnState3 = false;
static bool btnState4 = false;
static bool btnState5 = false;


void setup() {
  Serial.begin(9600);
  
  carrier.noCase();
  carrier.begin();
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
  carrier.Buttons.update();
  bool state = carrier.Buttons.getTouch(TOUCH0);
  if (state != btnState1) {
    btnState1 = state;

    StaticJsonDocument<128> eventDoc;
    eventDoc["event"] = "buttonPressed";
    eventDoc["data"]["pin"] = TOUCH0;
    eventDoc["data"]["state"] = state;

    String out;
    serializeJson(eventDoc, out);
    Serial.println(out);
  }

  state = carrier.Buttons.getTouch(TOUCH1);
  if (state != btnState2) {
    btnState2 = state;

    StaticJsonDocument<128> eventDoc;
    eventDoc["event"] = "buttonPressed";
    eventDoc["data"]["pin"] = TOUCH1;
    eventDoc["data"]["state"] = state;

    String out;
    serializeJson(eventDoc, out);
    Serial.println(out);
  }

  state = carrier.Buttons.getTouch(TOUCH2);
  if (state != btnState3) {
    btnState3 = state;

    StaticJsonDocument<128> eventDoc;
    eventDoc["event"] = "buttonPressed";
    eventDoc["data"]["pin"] = TOUCH2;
    eventDoc["data"]["state"] = state;

    String out;
    serializeJson(eventDoc, out);
    Serial.println(out);
  }

  state = carrier.Buttons.getTouch(TOUCH3);
  if (state != btnState4) {
    btnState4 = state;

    StaticJsonDocument<128> eventDoc;
    eventDoc["event"] = "buttonPressed";
    eventDoc["data"]["pin"] = TOUCH3;
    eventDoc["data"]["state"] = state;

    String out;
    serializeJson(eventDoc, out);
    Serial.println(out);
  }

  state = carrier.Buttons.getTouch(TOUCH4);
  if (state != btnState5) {
    btnState5 = state;

    StaticJsonDocument<128> eventDoc;
    eventDoc["event"] = "buttonPressed";
    eventDoc["data"]["pin"] = TOUCH4;
    eventDoc["data"]["state"] = state;

    String out;
    serializeJson(eventDoc, out);
    Serial.println(out);
  }

  // Event: temperatur hvert 2. sekund
  // if (millis() - lastTempTime > 2000) {
  //   lastTempTime = millis();

  //   float fakeTemp = 22.5 + (millis() % 1000) / 100.0; // Demo-temp

  //   StaticJsonDocument<128> eventDoc;
  //   eventDoc["event"] = "tempUpdate";
  //   eventDoc["data"]["temp"] = fakeTemp;

  //   String out;
  //   serializeJson(eventDoc, out);
  //   Serial.println(out);
  // }
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

  if (strcmp(cmd, "setLED") == 0) {
    int i = doc["data"]["i"] | 0;
    int r = doc["data"]["r"] | 0;
    int g = doc["data"]["g"] | 0;
    int b = doc["data"]["b"] | 0;

    carrier.leds.setPixelColor(i, r, g, b);
    carrier.leds.show();

    StaticJsonDocument<128> reply;
    reply["id"] = id;
    reply["data"]["ledSet" + String(i)] = true;
    reply["data"]["r"] = r;
    reply["data"]["g"] = g;
    reply["data"]["b"] = b;

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