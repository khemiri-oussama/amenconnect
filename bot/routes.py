from flask import Blueprint, request, jsonify
from datetime import datetime
from services.chatbot import generate_reply
from services.green_api import send_via_green_api, delete_notification

bp = Blueprint('main', __name__)

@bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    message = data.get('message')
    user = data.get('user', {})

    if not message:
        return jsonify({"error": "Message is required in the request body."}), 400

    # Construction du contexte utilisateur
    user_context = ""
    if user:
        if user.get('name'):
            user_context += f"User Name: {user['name']}. "
        if user.get('email'):
            user_context += f"Email: {user['email']}. "
        if user.get('cin'):
            user_context += f"Numero Cin: {user['cin']}. "
        if user.get('phone'):
            user_context += f"Telephone: {user['phone']}. "
        if user.get('accounts'):
            account_details = []
            for acc in user['accounts']:
                historique_details = []
                if isinstance(acc.get('historique'), list) and acc['historique']:
                    for h in acc['historique']:
                        date_str = datetime.fromisoformat(h['date']).strftime('%Y-%m-%d')
                        historique_details.append(
                            f"({h['type']}: {h['amount']} TND for {h['category']} on {date_str})"
                        )
                historique_str = ", ".join(historique_details) if historique_details else "No transactions"
                account_details.append(
                    f"Account Type: {acc.get('type', 'N/A')}, "
                    f"RIB: {acc.get('RIB', 'N/A')}, "
                    f"Solde: {acc.get('solde', 'N/A')} TND, "
                    f"Numéro Compte: {acc.get('numéroCompte', 'N/A')}, "
                    f"Modalités Retrait: {acc.get('modalitésRetrait', 'N/A')}, "
                    f"Conditions: {acc.get('conditionsGel', 'N/A')}, "
                    f"Domiciliation: {acc.get('domiciliation', 'N/A')}, "
                    f"Avec Chéquier: {'Yes' if acc.get('avecChéquier') else 'No'}, "
                    f"Avec Carte Bancaire: {'Yes' if acc.get('avecCarteBancaire') else 'No'}, "
                    f"Monthly Expenses: {acc.get('monthlyExpenses', 'N/A')} TND, "
                    f"Last Month Expenses: {acc.get('lastMonthExpenses', 'N/A')}, "
                    f"Historique: [{historique_str}]"
                )
            user_context += " | ".join(account_details)

    try:
        reply_message = generate_reply(message, user_context)

        # Si le numéro de téléphone est fourni, on envoie la réponse via Green API
        if user.get('phone'):
            response_api = send_via_green_api(user['phone'], reply_message)
            if response_api.status_code != 200:
                print("Green API response:", response_api.text)
                return jsonify({"error": "Failed to send message via Green API."}), 500

        return jsonify({"response": reply_message})
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "An error occurred while processing your request."}), 500

@bp.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json()
    print("Webhook received data:", data)

    if data.get('typeWebhook') != 'incomingMessageReceived':
        return jsonify({"status": "ignored"}), 200

    try:
        sender = data.get('senderData', {}).get('chatId', '')
        if not sender:
            return jsonify({"error": "No sender found in payload."}), 400
        phone = sender.split('@')[0]

        # Handle both text and extended text messages
        message_data = data.get('messageData', {})
        if message_data.get('typeMessage') == 'textMessage':
            incoming_message = message_data.get('textMessageData', {}).get('textMessage', '')
        elif message_data.get('typeMessage') == 'extendedTextMessage':
            incoming_message = message_data.get('extendedTextMessageData', {}).get('text', '')
        else:
            return jsonify({"error": "Unsupported message type"}), 400

        if not incoming_message:
            return jsonify({"error": "No message found in payload."}), 400

        user_context = f"Telephone: {phone}."
        reply_message = generate_reply(incoming_message, user_context)

        response_api = send_via_green_api(phone, reply_message)
        if response_api.status_code != 200:
            print("Failed to send reply via Green API:", response_api.text)
            return jsonify({"error": "Failed to send reply via Green API."}), 500

        receipt_id = data.get('idMessage')  # Changed from 'receiptId' to 'idMessage' based on sample data
        if receipt_id:
            delete_notification(receipt_id)

        return jsonify({"status": "success"}), 200

    except Exception as e:
        print("Webhook processing error:", e)
        return jsonify({"error": "Error processing webhook."}), 500