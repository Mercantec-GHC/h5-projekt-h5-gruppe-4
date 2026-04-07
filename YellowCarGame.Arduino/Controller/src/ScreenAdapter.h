#pragma once
#include <Arduino.h>
#include <ArduinoJson.h>
#include <Arduino_MKRIoTCarrier.h>
#include "EventSystem.h"

class ScreenAdapter {
public:
    void begin(EventSystem* sys, MKRIoTCarrier* carrier);

private:
    EventSystem* events = nullptr;
    MKRIoTCarrier* carrier = nullptr;

    void onDrawImage(JsonDocument& data);
};