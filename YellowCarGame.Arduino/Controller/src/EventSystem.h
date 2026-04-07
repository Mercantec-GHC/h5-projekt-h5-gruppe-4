#pragma once
#include <Arduino.h>
#include <ArduinoJson.h>
#include <functional>

typedef std::function<void(JsonDocument&)> EventCallback;
typedef std::function<void()> TimerCallback;

struct TimerEvent {
    unsigned long interval;
    unsigned long last;
    TimerCallback callback;
};

struct RegisteredEvent {
    String name;
    EventCallback callback;
};

class EventSystem {
public:
    void begin();
    void update();

    void on(String eventName, EventCallback cb);
    void every(unsigned long interval, TimerCallback cb);

    void trigger(String eventName, JsonDocument& data);
    void handleMessage(String jsonStr);

private:
    RegisteredEvent eventHandlers[20];
    int eventCount = 0;

    TimerEvent timerEvents[10];
    int timerCount = 0;

    String buffer;
};