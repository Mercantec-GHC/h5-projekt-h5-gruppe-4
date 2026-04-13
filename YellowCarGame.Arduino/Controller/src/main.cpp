#include <Arduino_MKRIoTCarrier.h>
#include "EventSystem.h"
#include "CarrierAdapter.h"
#include "ScreenAdapterChunked.h"
#include <Base64.h>

MKRIoTCarrier carrier;
EventSystem events;
CarrierAdapter carrierAdapter;
// ScreenAdapterChunked screen;

void onPing(JsonDocument& data) {
	// StaticJsonDocument<128> reply;
    JsonDocument reply;
    reply["id"] = data["id"] | -1;
    reply["data"]["pong"] = true;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}

void onGetTemp(JsonDocument& data) {
    float fakeTemp = 23.7;

    // StaticJsonDocument<128> reply;
    JsonDocument reply;
    reply["id"] = data["id"] | -1;
    reply["data"]["temp"] = fakeTemp;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}

void onTouch(JsonDocument& data) {
    String out;
    serializeJson(data, out);
    Serial.println(out);
}

void onSetPixel(JsonDocument& data) {
    int x = data["data"]["x"];
    int y = data["data"]["y"];
    uint16_t color = data["data"]["color"]; // RGB565

    carrier.display.drawPixel(x, y, color);

    // StaticJsonDocument<128> reply;
    JsonDocument reply;
    reply["id"] = data["id"];
    reply["data"]["ok"] = true;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}

void onSetLED(JsonDocument& data) {
    int i = data["data"]["i"];
    int r = data["data"]["r"];
    int g = data["data"]["g"];
    int b = data["data"]["b"];

    carrier.leds.setPixelColor(i, r, g, b);
    carrier.leds.show();

    // StaticJsonDocument<128> reply;
    JsonDocument reply;
    reply["id"] = data["id"] | -1;
    reply["data"]["ok"] = true;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}

void onSetPixelChunk(JsonDocument& data) {
    int x = data["data"]["x"];
    int y = data["data"]["y"];

    JsonArray arr = data["data"]["pixels"];

    for (int i = 0; i < arr.size(); i++) {
        carrier.display.drawPixel(x + i, y, (uint16_t)arr[i]);
    }

    StaticJsonDocument<64> reply;
    reply["id"] = data["id"];
    reply["data"]["ok"] = true;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}

void onSetPixelLine(JsonDocument& data) {
    int y = data["data"]["y"];
    const char* base64Const = data["data"]["buffer"];

    int encodedLen = strlen(base64Const);

    // LAV SKRIVBAR KOPI
    char* base64 = (char*)malloc(encodedLen + 1);
    strcpy(base64, base64Const);

    int decodedLen = base64_dec_len(base64, encodedLen);

    static uint8_t lineBuf[240 * 2]; // 480 bytes

    base64_decode((char*)lineBuf, base64, encodedLen);

    free(base64);

    carrier.display.drawRGBBitmap(
        0, y,
        (uint16_t*)lineBuf,
        240,
        1
    );

    StaticJsonDocument<64> reply;
    reply["id"] = data["id"];
    reply["data"]["ok"] = true;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}

void setup() {
    Serial.begin(9600);

    events.begin();
    carrierAdapter.begin(&events, &carrier);
    // screen.begin(&events, &carrier);

    events.on("ping", onPing);
    events.on("getTemp", onGetTemp);
    events.on("touch", onTouch);
    events.on("setLED", onSetLED);
    events.on("setPixel", onSetPixel);
    events.on("setPixelChunk", onSetPixelChunk);
    events.on("setPixelLine", onSetPixelLine);
}

void loop() {
    events.update();
    carrierAdapter.update();
}