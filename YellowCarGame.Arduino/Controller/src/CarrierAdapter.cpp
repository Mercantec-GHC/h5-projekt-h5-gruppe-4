#include "CarrierAdapter.h"

// Map integer index → touchButtons enum
static const touchButtons touchPins[5] = {
    TOUCH0, TOUCH1, TOUCH2, TOUCH3, TOUCH4
};

void CarrierAdapter::begin(EventSystem* sys, MKRIoTCarrier* c) {
    events = sys;
    carrier = c;

    carrier->noCase();
    carrier->begin();
}

void CarrierAdapter::update() {
    carrier->Buttons.update();

    for (int i = 0; i < 5; i++) {
        bool state = carrier->Buttons.getTouch(touchPins[i]);

        if (state != lastTouch[i]) {
            lastTouch[i] = state;
            sendTouchEvent(i, state);
        }
    }
}

void CarrierAdapter::sendTouchEvent(int pin, bool state) {
    // StaticJsonDocument<128> doc;
    JsonDocument doc;
    doc["event"] = "touch";
    doc["data"]["pin"] = pin;
    doc["data"]["state"] = state;

    // Trigger internal event
    events->trigger("touch", doc);
}