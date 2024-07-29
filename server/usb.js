diClass = require("@brightsign/deviceinfo");

const di = new diClass();

const parseTopology = function (usbT) {
  console.log("Parsing USB Topology: ", usbT);
  for (i in usbT) {
    console.log("Device: " + usbT[i].raw + " " + usbT[i].category);
    let device = usbT[i];
    if (device.category === "HUB") parseTopology(device.children);
    if (device.category === "NET")
      console.log("Found " + device.fid + " interface " + device.ident);
  }
};

di.getUsbTopology()
  .then((usbTopology) => {
    console.log("USB Topology:", usbTopology);
    parseTopology(usbTopology);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

const getSerialPorts = async function () {
  try {
    const ports = await serialPortList.list();
    console.log("Serial Ports:", ports);
  } catch (error) {
    console.error("Error:", error);
  }
};

getSerialPorts();
