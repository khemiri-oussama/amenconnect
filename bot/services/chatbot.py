from together import Together
from datetime import datetime
from config import TOGETHER_API_KEY, TOGETHER_MODEL

# Initialisation du client Together
client = Together(api_key=TOGETHER_API_KEY)

def generate_reply(message, user_context=""):
    """
    Génère une réponse en utilisant l'API Together.
    """
    banking_context = (
        "Email : amenbank@amenbank.com.tn. "
        "Téléphone : +216 71 100 100. "
        "Site web : www.amenbank.com.tn. "
        "Adresse : Avenue Habib Bourguiba, Tunis, Tunisie."
    )

    if user_context:
        system_content = (
            "Vous êtes un assistant bancaire professionnel. Saluez l'utilisateur par son nom et "
            f"utilisez le contexte suivant lorsque c'est approprié : {user_context}, {banking_context}"
        )
    else:
        system_content = (
            "Vous êtes un assistant bancaire professionnel. Utilisez le contexte suivant "
            f"lorsque c'est approprié : {banking_context}"
        )

    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": message}
    ]

    response = client.chat.completions.create(
        messages=messages,
        model=TOGETHER_MODEL
    )
    reply_message = response.choices[0].message.content
    return reply_message
