import wmi

def get_cpu_temperature():
    try:
        w = wmi.WMI(namespace="root\wmi")
        temp_sensors = w.MSAcpi_ThermalZoneTemperature()
        if temp_sensors:
            return (temp_sensors[0].CurrentTemperature / 10) - 273.15  # Convert from Kelvin
        return "No temperature sensor detected"
    except Exception as e:
        return f"Error: {e}"

print("CPU Temperature:", get_cpu_temperature(), "°C")
