from flask import Flask, jsonify
from flask_cors import CORS
import subprocess
import platform
import re

app = Flask(__name__)

# Allow cross-origin requests from your frontend origin (or use "*" for all origins in development)
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

@app.route('/serial', methods=['GET'])
def serial_api():
    serial = get_serial_number()
    return jsonify({"serial_number": serial})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
