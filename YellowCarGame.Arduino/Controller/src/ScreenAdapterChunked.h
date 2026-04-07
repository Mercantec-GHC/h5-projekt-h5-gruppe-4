#pragma once
#include <Arduino.h>
#include <ArduinoJson.h>
#include <Arduino_MKRIoTCarrier.h>
#include "EventSystem.h"

class ScreenAdapterChunked {
public:
    void begin(EventSystem* sys, MKRIoTCarrier* carrier);

private:
    EventSystem* events = nullptr;
    MKRIoTCarrier* carrier = nullptr;

    void onBeginImage(JsonDocument& data);
    void onImageChunk(JsonDocument& data);
    void onEndImage(JsonDocument& data);

    int imgWidth = 0;
    int imgHeight = 0;
};