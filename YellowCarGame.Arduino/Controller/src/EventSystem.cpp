#include "EventSystem.h"

void EventSystem::begin() {
    // Nothing hardware-specific
}

void EventSystem::on(String eventName, EventCallback cb) {
    eventHandlers[eventCount++] = { eventName, cb };
}

void EventSystem::every(unsigned long interval, TimerCallback cb) {
    timerEvents[timerCount++] = { interval, millis(), cb };
}

void EventSystem::trigger(String eventName, JsonDocument& data) {
    for (int i = 0; i < eventCount; i++) {
        if (eventHandlers[i].name == eventName) {
            eventHandlers[i].callback(data);
        }
    }
}

void EventSystem::update() {
    // --- Serial input ---
    while (Serial.available()) {
        char c = Serial.read();
        if (c == '\n') {
            handleMessage(buffer);
            buffer = "";
        } else {
            buffer += c;
        }
    }

    // --- Timer events ---
    unsigned long now = millis();
    for (int i = 0; i < timerCount; i++) {
        if (now - timerEvents[i].last >= timerEvents[i].interval) {
            timerEvents[i].last = now;
            timerEvents[i].callback();
        }
    }
}

void EventSystem::handleMessage(String jsonStr) {
    // StaticJsonDocument<256> doc;
    JsonDocument doc;
    if (deserializeJson(doc, jsonStr)) {
        Serial.println("{\"error\":\"invalid_json\"}");
        return;
    }

    const char* cmd = doc["cmd"];
    if (!cmd) return;

    // Trigger event "cmd"
    trigger(cmd, doc);
}