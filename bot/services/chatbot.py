from together import Together
from datetime import datetime
from config import TOGETHER_API_KEY, TOGETHER_MODEL
import re
client = Together(api_key=TOGETHER_API_KEY)

def generate_reply(message: str, user_context: str = "") -> str:

    # --- 1. Détection et simulation crédit immobilier ---
    immobilier_match = re.search(
        r"j[' ]ai\s*([0-9]+(?:\s*mille)?)\s*(dinars?)?.*acheter.*appartement\s*[àa]\s*([0-9]+(?:\s*mille)?)",
        message.lower()
    )
    if immobilier_match:
        def parse_tnd(s: str) -> int:
            s = s.replace("mille", "").strip()
            return int(s) * (1000 if "mille" in s else 1)

        apport = parse_tnd(immobilier_match.group(1))
        prix   = parse_tnd(immobilier_match.group(3))
        montant_pret = prix - apport

        # Paramètres du crédit
        taux_annuel = 4.75  # taux indicatif Immobilier
        duree_annees = 25   # durée max
        i = taux_annuel / 100 / 12
        n = duree_annees * 12
        mensualite = round(montant_pret * i / (1 - (1 + i)**(-n)), 2)

        return (
            f"🔍 Vous avez un apport de **{apport:,} TND** "
            f"pour un bien à **{prix:,} TND** (prêt nécessaire : **{montant_pret:,} TND**).\n\n"
            f"💡 **Proposition de Crédit Immobilier**\n"
            f"• Montant du prêt : {montant_pret:,} TND\n"
            f"• Durée maximale : {duree_annees} ans\n"
            f"• Taux fixe indicatif : {taux_annuel}%\n"
            f"• Mensualité estimée : {mensualite:,} TND/mois\n\n"
            "✅ Vous pouvez ajuster la durée ou le montant selon vos besoins.\n"
            "📌 Besoin d’un autre scénario ? Dites-le !"
        )

    # Enhanced non-banking filter with additional keywords
    NON_BANKING_KEYWORDS = {
        # English
        'python', 'code', 'programming', 'algorithm', 'development', 'math', 'physics',
        'engineering', 'gaming', 'game', 'games', 'play', 'movie', 'movies', 'film', 'series',
        'tv', 'music', 'song', 'sports'
        # French
        'jeu', 'jeux', 'jouer', 'films', 'film', 'musique', 'recette',
        'recettes', 'blague', 'blagues', 'poésie', 'littérature'
    }

    # Comprehensive bank profile with dynamic elements
    BANKING_PROFILE = (
        "🏦 **AMEN BANK** 🏦\n"
        "• Objet social : Activités bancaires\n"
        "• Forme juridique : Société anonyme de droit commun\n"
        "• Nationalité : Tunisienne\n"
        "• Siège social : Avenue Mohamed V - 1002 Tunis\n"
        "• Date de constitution : 1967 | Durée : 99 ans (sauf dissolution anticipée ou prorogation)\n"
        "• Capital social : 151 320 000 TND – 30 264 000 actions (valeur nominale : 5 TND)\n"
        "• Registre de commerce : 176041996 | Matricule fiscale : 000 M A 00221/M\n"
        "• Swift : CFCTTNTXXX\n"
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
         Assistant Expert Amen Bank 
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
        7. Utilsé simple format de reponse pas de text en gras est ect..
        8. Simple et clair pas de jargon technique
        9. Répondre simple et pas de long mot
        
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