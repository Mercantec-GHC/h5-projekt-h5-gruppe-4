#pragma once
#include <Arduino_MKRIoTCarrier.h>
#include "EventSystem.h"

class CarrierAdapter {
public:
    void begin(EventSystem* sys, MKRIoTCarrier* carrier);

    void update();

private:
    EventSystem* events;
    MKRIoTCarrier* carrier;

    bool lastTouch[5] = { false, false, false, false, false };

    void sendTouchEvent(int pin, bool state);
};