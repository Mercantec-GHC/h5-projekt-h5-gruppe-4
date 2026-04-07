#include "ScreenAdapter.h"
#include <Base64.h>

void ScreenAdapter::begin(EventSystem* sys, MKRIoTCarrier* c) {
    events = sys;
    carrier = c;

    events->on("drawImage", [this](JsonDocument& d) {
        // onDrawImage(d);
    });
}

void ScreenAdapter::onDrawImage(JsonDocument& data) {
    const char* base64Const = data["data"]["buffer"];
    int width  = data["data"]["width"]  | 240;
    int height = data["data"]["height"] | 240;

    if (!base64Const) {
        StaticJsonDocument<64> err;
        err["error"] = "missing_buffer";
        String out;
        serializeJson(err, out);
        Serial.println(out);
        return;
    }

    // Lav en skrivbar kopi af Base64-strengen
    int encodedLen = strlen(base64Const);
    char* base64 = (char*)malloc(encodedLen + 1);
    strcpy(base64, base64Const);

    // Beregn decoded længde
    int decodedLen = base64_dec_len(base64, encodedLen);

    uint8_t* buffer = (uint8_t*)malloc(decodedLen);
    if (!buffer) {
        free(base64);
        StaticJsonDocument<64> err;
        err["error"] = "malloc_failed";
        String out;
        serializeJson(err, out);
        Serial.println(out);
        return;
    }

    // Decode Base64 → raw RGB565 bytes
    base64_decode((char*)buffer, base64, encodedLen);

    free(base64);

    // Tegn billedet
    carrier->display.drawRGBBitmap(
        0, 0,
        (uint16_t*)buffer,
        width,
        height
    );

    free(buffer);

    StaticJsonDocument<64> reply;
    reply["event"] = "drawImageDone";

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}