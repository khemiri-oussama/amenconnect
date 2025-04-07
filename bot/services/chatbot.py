from together import Together
from datetime import datetime
from config import TOGETHER_API_KEY, TOGETHER_MODEL

client = Together(api_key=TOGETHER_API_KEY)

def generate_reply(message: str, user_context: str = "") -> str:
    """
    Generate intelligent banking responses with expanded financial knowledge base
    and contextual understanding for Amen Bank Tunisia.
    """
    
    # Enhanced non-banking filter with additional keywords
    NON_BANKING_KEYWORDS = {
        'python', 'code', 'programming', 'algorithm', 'development',
        'math', 'physics', 'engineering', 'gaming', 'entertainment'
    }

    # Comprehensive bank profile with dynamic elements
    BANKING_PROFILE = (
        "🏦 **Amen Bank Tunisia - Financial Profile 2024** 🏦\n"
        "📊 Actifs totaux : 15.2 milliards TND\n"
        "🌍 Réseau : 210 agences | 450 ATM | 35 kiosques automatiques\n"
        "👥 Clients : 1.8 million | Entreprises : 45,000\n"
        "⭐ Rating : Moody's A3 | Fitch BBB+\n"
        "🛡️ Dépôts garantis jusqu'à 50,000 TND\n"
        "🏆 Prix : Meilleure banque digitale Tunisie 2023\n"
    )

    # Expanded account types with conditions
    ACCOUNT_TYPES = (
        "\n💼 **Comptes Bancaires Détaillés** 💼\n"
        "• Compte Courant:\n"
        "  ✓ Ouverture: 50 TND | Frais mensuels: 0 TND\n"
        "  ✓ Virements illimités nationaux\n"
        "• Compte Épargne++:\n"
        "  ✓ Taux progressif (3.25%-4.15%)\n"
        "  ✓ Intérêts capitalisés trimestriellement\n"
        "• Compte Jeune Évolution (12-25 ans):\n"
        "  ✓ Carte gratuite | Offres partenaires\n"
        "  ✓ Programme de parrainage +5% d'intérêts\n"
        "• Compte Professionnel Pro:\n"
        "  ✓ Gestion centralisée multi-agences\n"
        "  ✓ Rapports financiers automatiques\n"
    )

    # Detailed loan matrix
    LOAN_MATRIX = (
        "\n📈 **Matrice des Crédits 2024** 📈\n"
        "| Type          | Taux(%) | Durée max | Montant max | Assurance |\n"
        "|---------------|---------|-----------|-------------|-----------|\n"
        "| Auto Neuve    | 5.9     | 7 ans     | 300,000 TND | Optionnelle |\n"
        "| Immobilier    | 4.75    | 25 ans    | 2M TND      | Obligatoire |\n"
        "| Études        | 3.9     | 15 ans    | 150,000 TND | Garant parent |\n"
        "| Liquidité Urg | 6.5     | 3 ans     | 50,000 TND  | Aucune    |\n"
        "⚠️ Taux variables selon profil client\n"
    )

    # Digital banking ecosystem
    DIGITAL_ECOSYSTEM = (
        "\n🌐 **Ecosystème Digital Avancé** 🌐\n"
        "✓ AmenPay :\n"
        "  ▸ Paiement QR sécurisé\n"
        "  ▸ Portefeuille électronique (limite: 5,000 TND/jour)\n"
        "✓ AmenTrade :\n"
        "  ▸ Plateforme de trading actions Tunisie\n"
        "  ▸ Analyse en temps réel + Alertes\n"
        "✓ AmenConnect Entreprise :\n"
        "  ▸ Intégration API comptabilité\n"
        "  ▸ Gestion multi-signatures\n"
        "✓ Reconnaissance vocale pour opérations\n"
    )

    # Enhanced security framework
    SECURITY_PROTOCOLS = (
        "\n🔐 **Sécurité Avancée** 🔐\n"
        "◉ Authentification multifactorielle\n"
        "◉ Surveillance 24/7 des transactions\n"
        "◉ Biométrie : Empreinte + Reconnaissance faciale\n"
        "◉ Chiffrement AES-256\n"
        "◉ SimSwap protection\n"
        "◉ Remboursement anti-fraude garanti\n"
    )

    # International services
    INTERNATIONAL_SERVICES = (
        "\n🌍 **Services Internationaux** 🌍\n"
        "➤ Transferts SWIFT : 0.1% frais (min 50 TND)\n"
        "➤ Cartes multi-devises (USD/EUR/GBP)\n"
        "➤ Lettres de crédit documentaire\n"
        "➤ Change instantané : 20 devises disponibles\n"
        "➤ Assistance consulaire mondiale\n"
    )

    # Dynamic financial tips
    FINANCIAL_ADVICE = (
        "\n💡 **Stratégies Financières Intelligentes** 💡\n"
        "① Utilisez la règle 50/30/20 :\n"
        "   - 50% besoins | 30% envies | 20% épargne\n"
        "② Optimisez vos crédits :\n"
        "   - Regroupement de dettes à 4.9%\n"
        "③ Épargne automatique :\n"
        "   - Programme Millefa à capital garanti\n"
        "④ Surveillance proactive :\n"
        "   - Alertes de solde | Dépenses catégorisées\n"
    )

    # Compliance framework
    COMPLIANCE_INFO = (
        "\n⚖️ **Conformité Réglementaire** ⚖️\n"
        "• Agrément BCT : N°A-2023-045\n"
        "• Protection données : RGPD certifié\n"
        "• Transactions suivies par la FINMA\n"
        "• Déclarations fiscales automatiques\n"
    )

    # Response logic
    if any(keyword in message.lower() for keyword in NON_BANKING_KEYWORDS):
        return (
            "🚫 **Hors Contexte Bancaire** 🚫\n"
            "Notre spécialité : Solutions financières innovantes\n"
            "➤ Services bancaires\n➤ Gestion de patrimoine\n➤ Conseil financier\n"
            "Contactez-nous via nos canaux officiels pour toute question non bancaire."
        )

    # Dynamic system prompt
    system_content = f"""
        🤖 **Assistant Expert Amen Bank** 🤖
        {BANKING_PROFILE}
        {ACCOUNT_TYPES}
        {LOAN_MATRIX}
        {DIGITAL_ECOSYSTEM}
        {SECURITY_PROTOCOLS}
        {INTERNATIONAL_SERVICES}
        {FINANCIAL_ADVICE}
        {COMPLIANCE_INFO}
        
        📌 **Stratégie de Réponse :**
        1. Analyser la complexité de la question
        2. Croiser les données réglementaires
        3. Proposer des solutions personnalisées
        4. Inclure des références vérifiables
        5. Anticiper les besoins connexes
        6. Maintenir un ton professionnel et rassurant
        
        👤 Historique Client : {user_context if user_context else "Nouvel Utilisateur"}
        📅 Contexte Temporel : {datetime.now().strftime('%A %d %B %Y %H:%M')}
    """

    messages = [{
        "role": "system",
        "content": system_content
    }, {
        "role": "user",
        "content": f"**Requête Client:** {message}\n→ Réponse attendue :"
    }]

    response = client.chat.completions.create(
        messages=messages,
        model=TOGETHER_MODEL,
        temperature=0.2,
        max_tokens=800,
        top_p=0.9,
        frequency_penalty=0.1
    )

    return response.choices[0].message.content