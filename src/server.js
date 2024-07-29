const express = require("express");
const diClass = require("@brightsign/deviceinfo");
const SerialPortListClass = require("@brightsign/serialportlist");
const SerialPort = require("@serialport/stream");
const BrightSignBinding = require("@brightsign/serialport");
const Readline = require("@serialport/parser-readline");
const WebSocket = require("ws");
// Create a WebSocket server
const wss = new WebSocket.Server({ port: 1234 });
// Create an Express server
const app = express();

// BrightSign path
var path = "/dev/ttyUSB0";

// Comment this out for prototyping on a non-BrightSign device
SerialPort.Binding = BrightSignBinding;

const options = {
  port: 2, // Port 0, 3.5mm Serial/RS232, Port 2, USB Serial
  baudRate: 115200, // Update to reflect the expected baud rate
  dataBits: 8,
  stopBits: 1,
  parity: "none",
  module_root: "/storage/sd", // Source for where serialport will look for the underlying module
};

const port = new SerialPort(path, options);
const parser = port.pipe(new Readline({ delimiter: "\r\n" }));

port.on("open", () => {
  console.log("Serial port is open");
});

parser.on("data", (data) => {
  console.log(typeof data, "Data:", data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
});

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Listen for messages from the front end
  ws.on("message", (message) => {
    console.log("Server Received:", message.toString());
    // Write the received message to the serial port with \r\n suffix
    port.write(message.toString() + "\r\n", (err) => {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
      console.log("Message written");
    });
  });
});

// Define the GET /serialports endpoint
app.get("/serialports", (req, res) => {
  const serialPortList = new SerialPortListClass();
  serialPortList.getList().then((ports) => {
    res.json(ports);
  });
});

// Start the Express server on port 3000
app.listen(3000, () => {
  console.log("Express server listening on port 3000");
});
