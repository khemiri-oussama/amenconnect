from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import platform
import re
import requests

app = Flask(__name__)
CORS(app, origins=["https://localhost:8200"])

def get_serial_number():
    system = platform.system()
    try:
        if system == "Windows":
            output = subprocess.check_output(["wmic", "bios", "get", "serialnumber"], universal_newlines=True)
            lines = [line.strip() for line in output.splitlines() if line.strip()]
            serial_lines = [line for line in lines if line.lower() != "serialnumber"]
            serial = serial_lines[0] if serial_lines else "Unknown or not available"
        elif system == "Linux":
            output = subprocess.check_output(["sudo", "dmidecode", "-s", "system-serial-number"], universal_newlines=True)
            serial = output.strip()
        elif system == "Darwin":
            output = subprocess.check_output(["system_profiler", "SPHardwareDataType"], universal_newlines=True)
            match = re.search(r"Serial Number.*: (.+)", output)
            serial = match.group(1).strip() if match else "Unknown"
        else:
            serial = "Unsupported OS"
    except Exception as e:
        serial = f"Error: {e}"
    return serial

def get_temperature():
    """
    Retrieves a temperature reading from the GPU using nvidia-smi.
    This command queries the GPU temperature in Celsius.
    """
    try:
        # Run the command to get the GPU temperature.
        # This returns a string like "45" (temperature in Celsius).
        output = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=temperature.gpu", "--format=csv,noheader,nounits"],
            universal_newlines=True
        )
        gpu_temp = output.strip()
        if gpu_temp.isdigit():
            return float(gpu_temp)
        else:
            print("nvidia-smi did not return a valid digit:", gpu_temp)
            return None
    except Exception as e:
        print("Error using nvidia-smi for GPU temperature:", e)
        return None

@app.route('/shutdown', methods=['POST'])
def shutdown_api():
    data = request.get_json()
    provided_serial = data.get("serialNumber")
    
    if not provided_serial:
        return jsonify({"error": "Serial number is required."}), 400

    local_serial = get_serial_number()
    if provided_serial != local_serial:
        return jsonify({"error": "Serial number mismatch."}), 403

    try:
        system = platform.system()
        if system == "Linux":
            subprocess.call(["shutdown", "-h", "now"])
        elif system == "Windows":
            subprocess.call(["shutdown", "/s", "/t", "0"])
        elif system == "Darwin":
            subprocess.call(["sudo", "shutdown", "-h", "now"])
        else:
            return jsonify({"error": "Unsupported OS for shutdown."}), 500

        return jsonify({"message": f"Shutdown initiated for serial {local_serial}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/serial', methods=['GET'])
def serial_api():
    print("serial_api route was called")
    serial = get_serial_number()
    return jsonify({"serial_number": serial})

@app.route('/temperature', methods=['GET'])
def temperature_api():
    temp = get_temperature()
    if temp is None:
        return jsonify({"error": "Could not retrieve temperature"}), 500
    return jsonify({"temperature": temp})

@app.route('/update-temp', methods=['POST'])
def update_temperature_api():
    temp = get_temperature()
    if temp is None:
        return jsonify({"error": "Could not retrieve temperature"}), 500

    local_serial = get_serial_number()
    payload = {
        "SN": local_serial,
        "temperature": temp
    }

    # Replace with your Node.js backend endpoint.
    node_backend_url = "http://localhost:3000/api/kiosk/update-temperature"

    try:
        response = requests.post(node_backend_url, json=payload)
        return jsonify({
            "message": "Temperature sent successfully.",
            "temperature": temp,
            "nodeResponse": response.json()
        }), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
