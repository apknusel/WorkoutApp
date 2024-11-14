const connectButton = document.getElementById('connectButton');
const statusDisplay = document.getElementById('status');
const dataDisplay = document.getElementById('data');
const deviceNameInput = document.getElementById('deviceName');

const SERVICE_UUID = 0x1826;
const CHARACTERISTIC_UUID = 0x2AD2;

let bleDevice = null;
let characteristic = null;
let receivedData = [];

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
        connectButton.textContent = 'Connecting...';
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

        connectButton.textContent = 'Disconnect';
        connectButton.classList.add('connected');
    } catch (error) {
        connectButton.textContent = 'Connection Failed';
        console.error('Connection failed!', error);
    }
});

function disconnect() {
    if (!bleDevice) return;
    if (bleDevice.gatt.connected) {
        bleDevice.gatt.disconnect();
        connectButton.textContent = 'Connect';
        connectButton.classList.remove('connected');
    }
    bleDevice = null;
}

function handleCharacteristicValueChanged(event) {
    const value = event.target.value.getUint8(0);
    receivedData.push(value)
    console.log(`Data Received: ${value}`);
}

function addExercise() {
    const exerciseDiv = document.createElement('div');
    exerciseDiv.classList.add('exercise');

    exerciseDiv.innerHTML = `
      <input type="text" placeholder="Exercise">
      <input type="number" placeholder="Reps">
      <input type="number" disabled>
      <input type="number" disabled>
      <input type="number" disabled>
      <input type="text" disabled>
      <button onclick="toggleSelect(this)"> Select </button>
    `;

    document.getElementById('exercises').appendChild(exerciseDiv);
}

function toggleSelect(button) {
    if (button.classList.contains('selected')) {
        button.classList.remove('selected');
        button.textContent = 'Select';
    } else {
        button.classList.add('selected');
        button.textContent = 'Selected';
    }
}

function updateFields(difficulty, avg_heart_rate, blood_oxygen, time) {
    const exerciseDiv = repsInput.parentElement;

    exerciseDiv.children[2].value = `${difficulty}%`;
    exerciseDiv.children[3].value = `${avg_heart_rate}bpm`;
    exerciseDiv.children[4].value = `${blood_oxygen}%`;
    exerciseDiv.children[5].value = formatTime(time);
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millisecondsPart = milliseconds % 1000;

    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millisecondsPart.toString().padStart(3, '0').slice(0, 2)}`;
}