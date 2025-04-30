from flask import Blueprint, request, jsonify
from datetime import datetime
from services.chatbot import generate_reply
from services.green_api import send_via_green_api, delete_notification

bp = Blueprint('main', __name__)

@bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json() or {}
    message = data.get('message')
    user = data.get('user', {})
    credits = user.get('credits', [])

    if not message:
        return jsonify({"error": "Message is required in the request body."}), 400

    # Construction du contexte utilisateur
    user_context_parts = []
    # Profil de base
    if user.get('name'):
        user_context_parts.append(f"Nom : {user['name']}")
    if user.get('email'):
        user_context_parts.append(f"Email : {user['email']}")
    if user.get('cin'):
        user_context_parts.append(f"CIN : {user['cin']}")
    if user.get('phone'):
        user_context_parts.append(f"Téléphone : {user['phone']}")

    # Comptes bancaires
    accounts = user.get('accounts', [])
    if isinstance(accounts, list) and accounts:
        for acc in accounts:
            # Historique des transactions
            histo = []
            for h in acc.get('historique', []):
                try:
                    date_str = datetime.fromisoformat(h.get('date', '')).strftime('%Y-%m-%d')
                except Exception:
                    date_str = 'Inconnue'
                histo.append(f"{h.get('type','N/A')}: {h.get('amount','N/A')} TND le {date_str}")
            histo_str = "; ".join(histo) if histo else "Aucune transaction"

            # Détails du compte
            user_context_parts.append(
                (
                    f"Compte {acc.get('numéroCompte','N/A')} (Type: {acc.get('type','N/A')}), "
                    f"IBAN: {acc.get('IBAN','N/A')}, RIB: {acc.get('RIB','N/A')}, "
                    f"Solde: {acc.get('solde','N/A')} TND, "
                    f"Modalités de retrait: {acc.get('modalitésRetrait','N/A')}, "
                    f"Conditions de gel: {acc.get('conditionsGel','N/A')}, "
                    f"Avec chéquier: {'Oui' if acc.get('avecChéquier') else 'Non'}, "
                    f"Avec CB: {'Oui' if acc.get('avecCarteBancaire') else 'Non'}, "
                    f"Historique: [{histo_str}]"
                )
            )

    # Crédits
    if isinstance(credits, list) and credits:
        for c in credits:
            user_context_parts.append(
                (
                    f"Crédit {c.get('_id','N/A')} (Type: {c.get('typeCredit','N/A')}), "
                    f"Montant: {c.get('montant','N/A')} TND, "
                    f"Début: {c.get('dateDebut','N/A')}, Fin: {c.get('dateFin','N/A')}, "
                    f"Taux: {c.get('tauxInteret','N/A')}%, Mensualité: {c.get('mensualite','N/A')} TND, "
                    f"Statut: {c.get('statut','N/A')}"
                )
            )

    # Concaténation du contexte
    user_context = " | ".join(user_context_parts)

    try:
        reply_message = generate_reply(message, user_context)
        return jsonify({"response": reply_message}), 200
    except Exception as e:
        print("Error in /chat:", e)
        return jsonify({"error": "An error occurred while processing your request."}), 500


@bp.route('/webhook', methods=['POST'])
def webhook():
    data = request.get_json() or {}
    print("Webhook received data:", data)

    if data.get('typeWebhook') != 'incomingMessageReceived':
        return jsonify({"status": "ignored"}), 200

    try:
        sender = data.get('senderData', {}).get('chatId', '')
        if not sender:
            return jsonify({"error": "No sender found in payload."}), 400
        phone = sender.split('@')[0]

        # Extraire le message entrant
        msg_data = data.get('messageData', {})
        if msg_data.get('typeMessage') == 'textMessage':
            incoming = msg_data.get('textMessageData', {}).get('textMessage', '')
        elif msg_data.get('typeMessage') == 'extendedTextMessage':
            incoming = msg_data.get('extendedTextMessageData', {}).get('text', '')
        else:
            return jsonify({"error": "Unsupported message type"}), 400

        if not incoming:
            return jsonify({"error": "No message found in payload."}), 400

        user_context = f"Téléphone: {phone}"
        reply = generate_reply(incoming, user_context)

        # Envoi via Green API (non bloquant)
        try:
            resp_api = send_via_green_api(phone, reply)
            if resp_api.status_code != 200:
                print("Green API response (non-fatal):", resp_api.text)
        except Exception as send_err:
            print("Green API send error (non-fatal):", send_err)

        # Supprimer notification
        receipt_id = data.get('idMessage')
        if receipt_id:
            delete_notification(receipt_id)

        return jsonify({"status": "success"}), 200
    except Exception as e:
        print("Error in /webhook:", e)
        return jsonify({"error": "Error processing webhook."}), 500
