class ArduinoClient {
  constructor(logFn) {
    this.port = null;
    this.writer = null;
    this.readBuffer = "";
    this.nextId = 1;
    this.pending = {};
    this.eventHandlers = {};
    this.log = logFn;
  }

  async connect() {
    this.port = await navigator.serial.requestPort();
    await this.port.open({ baudRate: 9600 });

    this.writer = this.port.writable.getWriter();

    const decoder = new TextDecoderStream();
    this.port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();

    if (this.log)
      this.log("CONNECTED");

    this.port.ondisconnect = () => {
      if (this.log)
        this.log("DISCONNECTED");
    }

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      this.readBuffer += value;
      let lines = this.readBuffer.split("\n");
      this.readBuffer = lines.pop();

      for (let line of lines) {
        if (line.trim().length === 0) continue;
        this.handleMessage(JSON.parse(line));
      }
    }
  }

  handleMessage(msg) {
    if (this.log)
      this.log("RX: " + JSON.stringify(msg));

    if (msg.id && this.pending[msg.id]) {
      this.pending[msg.id].resolve(msg.data);
      delete this.pending[msg.id];
      return;
    }

    if (msg.event && this.eventHandlers[msg.event]) {
      this.eventHandlers[msg.event].forEach(cb => cb(msg.data));
    }
  }

  async request(cmd, data = {}) {
    const id = this.nextId++;
    const packet = { id, cmd, data };

    const json = JSON.stringify(packet) + "\n";
    if (this.log)
      this.log("TX: " + json.trim());
    await this.writer.write(new TextEncoder().encode(json));

    return new Promise((resolve, reject) => {
      this.pending[id] = { resolve, reject };
      setTimeout(() => {
        if (this.pending[id]) {
          reject("Timeout");
          delete this.pending[id];
        }
      }, 2000);
    });
  }

  on(eventName, callback) {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(callback);
  }
}