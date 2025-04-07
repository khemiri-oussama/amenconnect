import requests
from config import GREEN_API_URL, GREEN_API_TOKEN

def send_via_green_api(phone, message):
    """
    Envoie un message au numéro de téléphone fourni via Green API.
    Le numéro de téléphone doit être au format international.
    """
    chat_id = f"{phone}@c.us"
    send_url = f"{GREEN_API_URL}/sendMessage/{GREEN_API_TOKEN}"
    payload = {"chatId": chat_id, "message": message}
    response = requests.post(send_url, json=payload)
    return response

def delete_notification(receipt_id):
    """
    Supprime une notification sur Green API.
    """
    delete_url = f"{GREEN_API_URL}/deleteNotification/{GREEN_API_TOKEN}/{receipt_id}"
    requests.delete(delete_url)
