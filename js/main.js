const connectButton = document.getElementById('connectButton');
const statusDisplay = document.getElementById('status');
const dataDisplay = document.getElementById('data');
const deviceNameInput = document.getElementById('deviceName');
const dataChartCtx = document.getElementById('dataChart').getContext('2d');

const SERVICE_UUID = 0x1826;
const CHARACTERISTIC_UUID = 0x2AD2;

let bleDevice = null;
let characteristic = null;
let dataPoints = [];

// Initialize Chart.js
const dataChart = new Chart(dataChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'BLE Data',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                position: 'bottom'
            }
        }
    }
});

connectButton.addEventListener('click', async () => {
    if (bleDevice) {
        disconnect();
        return;
    }
    try {
        // Get the device name from input
        const deviceName = deviceNameInput.value;
        if (!deviceName) {
            alert("Please enter a device name.");
            return;
        }

        // Request the Bluetooth device with specified name and service
        statusDisplay.textContent = 'Status: Connecting...';
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: deviceName }],
            optionalServices: [SERVICE_UUID]  // Include the service UUID in optionalServices
        });

        // Connect to GATT server
        const server = await bleDevice.gatt.connect();
        const service = await server.getPrimaryService(SERVICE_UUID);
        characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

        // Set up notifications
        await characteristic.startNotifications();
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged);

        statusDisplay.textContent = 'Status: Connected';
        connectButton.textContent = 'Disconnect';
    } catch (error) {
        console.error('Connection failed!', error);
        statusDisplay.textContent = 'Status: Failed to connect';
    }
});

function disconnect() {
    if (!bleDevice) return;
    if (bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
        statusDisplay.textContent = 'Status: Disconnected';
        connectButton.textContent = 'Connect';
        dataDisplay.textContent = 'Data Received: None';
    }
    bleDevice = null;
}

function handleCharacteristicValueChanged(event) {
    const value = event.target.value.getUint8(0);
    let text = `Data Received: ${value}`;
    dataDisplay.textContent = `BLE Data: ${text}`;

    // Append the data to the dataPoints array
    dataPoints.push(value);

    // Update the chart
    dataChart.data.labels.push(dataPoints.length); // X-axis label
    dataChart.data.datasets[0].data.push(value); // Y-axis data
    dataChart.update();
}