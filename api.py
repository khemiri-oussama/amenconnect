from flask import Flask, jsonify, request
from flask_cors import CORS
import subprocess
import platform
import re
import requests
import time
import pyrebase
import threading
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

# Firebase configuration
firebase_config = {
    "apiKey": "AIzaSyD0qjnrDLjAs0BGQavFuvV7zQhgJ6ijos0",
    "authDomain": "kiosk-b8f76.firebaseapp.com",
    "databaseURL": "https://kiosk-b8f76-default-rtdb.firebaseio.com",
    "storageBucket": "kiosk-b8f76.firebasestorage.app",
}

# Connect to MongoDB using your provided URI
MONGO_URI = "mongodb+srv://backend:GpwHU0tIVU3Wsi2z@amenconnect.4vekp.mongodb.net/client?retryWrites=true&w=majority"
mongo_client = MongoClient(MONGO_URI)
db = mongo_client.get_database()  # Uses the default database from the URI
kiosks_collection = db.kiosks     # Assumes kiosks are stored in the 'kiosks' collection

def get_serial_number():
    system = platform.system()
    try:
        if system == "Windows":
            output = subprocess.check_output(
                ["wmic", "bios", "get", "serialnumber"], universal_newlines=True
            )
            lines = [line.strip() for line in output.splitlines() if line.strip()]
            serial_lines = [line for line in lines if line.lower() != "serialnumber"]
            serial = serial_lines[0] if serial_lines else "Unknown or not available"
        elif system == "Linux":
            output = subprocess.check_output(
                ["sudo", "dmidecode", "-s", "system-serial-number"], universal_newlines=True
            )
            serial = output.strip()
        elif system == "Darwin":
            output = subprocess.check_output(
                ["system_profiler", "SPHardwareDataType"], universal_newlines=True
            )
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

def update_kiosk_status(new_status, additional_fields=None):
    """
    Updates the kiosk document (found by its serial number) in MongoDB.
    """
    serial = get_serial_number()
    update_fields = {"status": new_status}
    if additional_fields:
        update_fields.update(additional_fields)
    result = kiosks_collection.update_one({"SN": serial}, {"$set": update_fields})
    if result.matched_count:
        print(f"Kiosk with serial {serial} updated to {new_status}.")
    else:
        print(f"Kiosk with serial {serial} not found in the database.")

@app.route('/shutdown', methods=['POST'])
def shutdown_api():
    """
    Issues a shutdown command via Firebase after verifying the provided serial number.
    """
    data = request.get_json()
    provided_serial = data.get("serialNumber")
    
    if not provided_serial:
        return jsonify({"error": "Serial number is required."}), 400

    local_serial = get_serial_number()
    if provided_serial != local_serial:
        return jsonify({"error": "Serial number mismatch."}), 403

    firebase = pyrebase.initialize_app(firebase_config)
    db_fb = firebase.database()
    
    shutdown_data = {
        "command": "shutdown",
        "timestamp": int(time.time())
    }

    try:
        # Write the shutdown command under the node 'shutdown_commands/<local_serial>'.
        db_fb.child("shutdown_commands").child(local_serial).set(shutdown_data)
        exit()  # Exits the process after setting the command.
        print("Shutdown command return code:")
        return jsonify({"message": f"Shutdown command sent to serial {local_serial} via Firebase."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def firebase_shutdown_listener():
    """
    Listens for shutdown commands from Firebase and executes a system shutdown when received.
    """
    firebase = pyrebase.initialize_app(firebase_config)
    db_fb = firebase.database()
    local_serial = get_serial_number()
    while True:
        try:
            command = db_fb.child("shutdown_commands").child(local_serial).get().val()
            if command and command.get("command") == "shutdown":
                system = platform.system()
                if system == "Windows":
                    subprocess.run(["shutdown", "/s", "/t", "0"], shell=True)
                elif system == "Linux":
                    subprocess.run(["sudo", "shutdown", "now"], check=True)
                elif system == "Darwin":
                    subprocess.run(["sudo", "shutdown", "-h", "now"], check=True)
                # Remove the command from Firebase after execution
                db_fb.child("shutdown_commands").child(local_serial).remove()
                break  # Exit the loop once shutdown is initiated
        except Exception as e:
            print(f"Error checking shutdown command: {e}")
        time.sleep(60)  # Check every 60 seconds

@app.route('/serial', methods=['GET'])
def serial_api():
    """
    Returns the kiosk's serial number.
    """
    serial = get_serial_number()
    return jsonify({"serial_number": serial})

@app.route('/temperature', methods=['GET'])
def temperature_api():
    """
    Returns the GPU temperature.
    """
    temp = get_temperature()
    if temp is None:
        return jsonify({"error": "Could not retrieve temperature"}), 500
    return jsonify({"temperature": temp})

@app.route('/update-temp', methods=['POST'])
def update_temperature_api():
    """
    Retrieves the current GPU temperature and forwards it to the Node.js backend.
    """
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

def keep_online(interval=30):
    """
    Background task that continuously sets the kiosk's status to "online"
    with an updated timestamp. This ensures that as long as the Flask app is
    running, the kiosk will be marked online in the database.
    """
    while True:
        update_kiosk_status("online", {"last_heartbeat": time.time()})
        time.sleep(interval)

if __name__ == '__main__':
    # Start the Firebase shutdown listener in a background thread.
    shutdown_listener_thread = threading.Thread(target=firebase_shutdown_listener, daemon=True)
    shutdown_listener_thread.start()
    
    # Start the keep_online thread to constantly update the kiosk's status to "online".
    online_thread = threading.Thread(target=keep_online, daemon=True)
    online_thread.start()

    app.run(host='0.0.0.0', port=3000)
