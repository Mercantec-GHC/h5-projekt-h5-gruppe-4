#include "ScreenAdapterChunked.h"
#include <Base64.h>

void ScreenAdapterChunked::begin(EventSystem* sys, MKRIoTCarrier* c) {
    events = sys;
    carrier = c;

    events->on("beginImage", [this](JsonDocument& d) { onBeginImage(d); });
    events->on("imageChunk", [this](JsonDocument& d) { onImageChunk(d); });
    events->on("endImage",   [this](JsonDocument& d) { onEndImage(d); });
}

// ------------------------------------------------------------
// BEGIN IMAGE
// ------------------------------------------------------------
void ScreenAdapterChunked::onBeginImage(JsonDocument& data) {
    imgWidth  = data["data"]["width"]  | 240;
    imgHeight = data["data"]["height"] | 240;

    carrier->display.fillScreen(0x0000);

    // RPC-svar
    StaticJsonDocument<64> reply;
    reply["id"] = data["id"];
    reply["data"]["ok"] = true;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}

// ------------------------------------------------------------
// IMAGE CHUNK
// ------------------------------------------------------------

// Statisk buffer: 240 * 10 * 2 bytes = 4800 bytes
static uint8_t chunkBuffer[240 * 10 * 2];

void ScreenAdapterChunked::onImageChunk(JsonDocument& data) {
    const char* base64Const = data["data"]["buffer"];
    int y      = data["data"]["y"];
    int height = data["data"]["height"];

    int encodedLen = strlen(base64Const);

    // Lav skrivbar kopi
    char* base64 = (char*)malloc(encodedLen + 1);
    strcpy(base64, base64Const);

    int decodedLen = base64_dec_len(base64, encodedLen) + 32;

    if (decodedLen > sizeof(chunkBuffer)) {
        free(base64);
        return;
    }

    base64_decode((char*)chunkBuffer, base64, encodedLen);
    free(base64);

    carrier->display.drawRGBBitmap(
        0, y,
        (uint16_t*)chunkBuffer,
        imgWidth,
        height
    );

    // RPC-svar
    StaticJsonDocument<64> reply;
    reply["id"] = data["id"];
    reply["data"]["y"] = y;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}

// ------------------------------------------------------------
// END IMAGE
// ------------------------------------------------------------
void ScreenAdapterChunked::onEndImage(JsonDocument& data) {
    StaticJsonDocument<64> reply;
    reply["id"] = data["id"];
    reply["data"]["done"] = true;

    String out;
    serializeJson(reply, out);
    Serial.println(out);
}