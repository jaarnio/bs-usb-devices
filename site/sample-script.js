// this script grabs enumerated devices and attempts to match unique vid/pids to usb toplogy from node app.
async function fetchAndMatchDevices() {
  try {
    // Fetch the array of JSON objects from the endpoint
    const response = await fetch("http://localhost:3000/getPort");
    const devicesArray = await response.json();
    console.log("Received: ", devicesArray);

    // Get the connected devices
    const connectedDevices = await navigator.mediaDevices.enumerateDevices();

    // Iterate through the array of JSON objects
    devicesArray.forEach((deviceObj) => {
      // Find devices whose kind is "videoinput"
      connectedDevices.forEach((connectedDevice) => {
        if (connectedDevice.kind === "videoinput") {
          // Parse the label field to find the vidpid
          const labelMatch = connectedDevice.label.match(/\((\w{4}:\w{4})\)/);
          if (labelMatch) {
            const vidpid = labelMatch[1];
            // If the vidpid matches, add the id to the JSON object
            if (vidpid === deviceObj.vidpid) {
              deviceObj.id = connectedDevice.deviceId;
            }
          }
        }
      });
    });

    // Console log the final array
    console.log("Final devicesArray: ", devicesArray);

    // Set up video elements based on the devicesArray
    devicesArray.forEach((deviceObj) => {
      if (deviceObj.port === "B/2.0") {
        setupVideoElement("video1", deviceObj.id);
      } else if (deviceObj.port === "B/1.0") {
        setupVideoElement("video2", deviceObj.id);
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function setupVideoElement(videoElementId, deviceId) {
  const videoElement = document.getElementById(videoElementId);
  if (videoElement) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
      });
      videoElement.srcObject = stream;
    } catch (error) {
      console.error(`Error setting up video element ${videoElementId}:`, error);
    }
  }
}

// Call the function to fetch and match devices
fetchAndMatchDevices();
