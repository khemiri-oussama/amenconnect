from together import Together
from datetime import datetime
from config import TOGETHER_API_KEY, TOGETHER_MODEL

# Initialize the Together client
client = Together(api_key=TOGETHER_API_KEY)

def generate_reply(message: str, user_context: str = "") -> str:
    """
    Generate an appropriate banking response based on user input, filtering out non-banking queries.
    
    Args:
        message: User's input message
        user_context: Optional user context for personalized responses
        
    Returns:
        str: Generated response adhering to banking context guidelines
    """
    
    # Constants declaration with enhanced formatting
    NON_BANKING_KEYWORDS = {
        'python', 'code', 'programmation', 
        'algorithm', 'développement'
    }
    
    BANKING_CONTEXT = (
        "🌍 **Coordonnées Principales** 🌍\n"
        "📍 Email : amenbank@amenbank.com.tn\n"
        "📞 Téléphone principal : +216 71 100 100\n"
        "👥 Centre de Relation Clients : +216 71 148 888 (24h/24)\n"
        "🌐 Site web : www.amenbank.com.tn\n"
        "🏛️ Adresse principale : Avenue Habib Bourguiba, Tunis, Tunisie\n"
        "🏢 Siège secondaire : Avenue Mohamed V, 1002 Tunis\n"
        "⏰ Horaires d'ouverture : Lundi-Vendredi 8h-17h, Samedi 8h-13h\n"
    )

    ACCOUNT_TYPES = (
        "\n💳 **Types de Comptes** 💳\n"
        "✓ Compte Courant (Aucun frais de tenue de compte)\n"
        "✓ Compte Épargne (Taux d'intérêt compétitif de 3.25%)\n"
        "✓ Compte Jeunes (12-25 ans, offre spéciale sans frais)\n"
        "✓ Compte Devises (USD, EUR, GBP)\n"
        "✓ Compte Professionnel (Solutions sur mesure pour entreprises)\n"
    )

    LOAN_SERVICES = (
        "\n🏦 **Services de Crédit** 🏦\n"
        "➤ Crédit Auto (Taux à partir de 5.9%)\n"
        "➤ Crédit Immobilier (Jusqu'à 25 ans de remboursement)\n"
        "➤ Crédit Personnel (Décision rapide en 48h)\n"
        "➤ Crédit Étudiant (Paiement différé après diplôme)\n"
        "➤ Ligne de crédit professionnel (Flexible jusqu'à 500 000 TND)\n"
    )

    DIGITAL_SERVICES = (
        "\n📱 **Services Digitaux Avancés** 📱\n"
        "✓ Amen Mobile :\n"
        "  ▸ Virements instantanés\n"
        "  ▸ Paiement de factures\n"
        "  ▸ Rechargement mobile\n"
        "✓ @mennet :\n"
        "  ▸ Simulation de crédit en temps réel\n"
        "  ▸ Alertes de solde personnalisées\n"
        "  ▸ Historique de transactions sur 5 ans\n"
        "✓ Signature électronique sécurisée\n"
        "✓ Reconnaissance faciale pour accès mobile\n"
    )

    CARDS_AND_SECURITY = (
        "\n🔒 **Cartes & Sécurité** 🔒\n"
        "✓ Carte DALOULA : Sans contact, plafond quotidien 2000 TND\n"
        "✓ Carte VISA GOLD : Assurance voyage incluse\n"
        "✓ Carte Virtuelle : Pour achats en ligne sécurisés\n"
        "✓ 3D Secure pour tous les paiements en ligne\n"
        "✓ Blocage instantané via l'application\n"
    )

    BANKING_DIRECTIVE = (
        "\n⚠️ **Directives de Réponse** ⚠️\n"
        "➔ Prioriser les informations officielles du site web\n"
        "➔ Mentionner toujours les sources d'information\n"
        "➔ Proposer des solutions étape par étape\n"
        "➔ Inclure des références de contact pertinentes\n"
        "➔ Maintenir un langage simple et accessible\n"
        "➔ Vérifier la disponibilité des services mentionnés\n"
    )

    FINANCIAL_TIPS = (
        "\n💡 **Conseils Financiers** 💡\n"
        "• Épargnez au moins 10% de vos revenus mensuels\n"
        "• Comparez toujours les offres de crédit\n"
        "• Activez les notifications de transaction\n"
        "• Vérifiez régulièrement votre score crédit\n"
        "• Utilisez l'authentification à deux facteurs\n"
    )

    # Preliminary filtering response
    NON_BANKING_RESPONSE = (
        "🚫 **Attention - Sujet Non Bancaire** 🚫\n\n"
        "Nous sommes désolés, mais nous ne pouvons répondre qu'aux questions concernant :\n"
        "• Les services bancaires d'Amen Bank\n"
        "• Les produits financiers\n"
        "• L'assistance clientèle\n\n"
        "Merci de votre compréhension ! 🤝"
    )

    # Preliminary filtering for non-banking topics
    if any(keyword in message.lower() for keyword in NON_BANKING_KEYWORDS):
        return NON_BANKING_RESPONSE

    # System prompt construction
    base_system_content = (
        "🤖 **Assistant Virtuel Amen Bank** 🤖\n"
        f"{BANKING_CONTEXT}\n"
        f"{ACCOUNT_TYPES}\n"
        f"{LOAN_SERVICES}\n"
        f"{DIGITAL_SERVICES}\n"
        f"{CARDS_AND_SECURITY}\n"
        f"{FINANCIAL_TIPS}\n"
        f"{BANKING_DIRECTIVE}"
    )

    personalized_greeting = (
        f"\n👤 **Bienvenue {user_context}** 👤\n"
        if user_context
        else "\n🌟 **Bienvenue chez Amen Bank** 🌟\n"
    )

    system_content = (
        f"{base_system_content}{personalized_greeting}"
        if user_context
        else f"{base_system_content}"
    )

    # Message structure for AI model
    messages = [
        {
            "role": "system",
            "content": system_content
        },
        {
            "role": "user",
            "content": f"📩 Message reçu le {datetime.now().strftime('%d/%m/%Y %H:%M')} :\n« {message} »"
        }
    ]

    # Generate response from AI model
    response = client.chat.completions.create(
        messages=messages,
        model=TOGETHER_MODEL,
        temperature=0.3,
        max_tokens=600  # Extended for more detailed responses
    )

    return response.choices[0].message.content
