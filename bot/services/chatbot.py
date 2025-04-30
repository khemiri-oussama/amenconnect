import json
from together import Together
from datetime import datetime
from config import TOGETHER_API_KEY, TOGETHER_MODEL
import re

# Structured bank data
BANKING_PROFILE = {
    "nom": "Amen Bank",
    "objet_social": "Activités bancaires",
    "forme_juridique": "Société anonyme de droit commun",
    "nationalite": "Tunisienne",
    "siege_social": "Avenue Mohamed V - 1002 Tunis",
    "date_constitution": "1967",
    "duree": "99 ans",
    "capital_social": "151320000 TND",
    "actions": "30264000",
    "registre_commerce": "176041996",
    "matricule_fiscale": "000 M A 00221/M",
    "swift": "CFCTTNTXXX",
    "historique": (
        "Fondée en 1966 sous le nom de Crédit Foncier et Commercial de Tunisie (CFCT), "
        "Amen Bank est devenue une entité bancaire indépendante en 1995. Elle fait partie du Groupe Amen, "
        "un conglomérat opérant dans plusieurs secteurs économiques en Tunisie."
    ),
    "groupe": (
        "Le Groupe Amen est actif dans l’agroalimentaire, les assurances, les services financiers spécialisés, "
        "et le commerce de biens d’équipement. Il emploie environ 4 000 personnes."
    ),
    "reseau": (
        "La banque dispose d’un réseau de 164 agences réparties sur tout le territoire tunisien, "
        "offrant une excellente couverture géographique."
    ),
    "services": (
        "Amen Bank propose des comptes courants, épargne, jeunes, professionnels, des prêts (auto, immo, études, etc.), "
        "ainsi que des cartes, et services de banque en ligne/mobile. Elle a été pionnière de la banque à distance en Tunisie en 2009."
    ),
    "engagement": (
        "Amen Bank soutient activement des initiatives sociétales, promeut l'innovation et garantit un service client de qualité "
        "en respectant des standards élevés de gouvernance."
    ),
    "site_web": "https://www.amenbank.com.tn/"
}

ACCOUNT_TYPES = [
    {"nom": "Compte Courant", "ouverture": "50 TND", "frais_mensuels": "0 TND", "virements": "illimités nationaux"},
    {"nom": "Compte Épargne++", "taux_progressif": "3.25%-4.15%", "capitalisation": "trimestrielle"},
    {"nom": "Compte Jeune Évolution (12-25 ans)", "carte": "gratuite", "parrainage": "+5% intérêts"},
    {"nom": "Compte Professionnel Pro", "gestion": "multi-agences", "rapports": "automatiques"}
]

LOAN_MATRIX = [
    {"type": "Auto Neuve", "taux": 5.9, "duree_max": "7 ans", "montant_max": "300000 TND", "assurance": "Optionnelle"},
    {"type": "Immobilier", "taux": 4.75, "duree_max": "25 ans", "montant_max": "2000000 TND", "assurance": "Obligatoire"},
    {"type": "Études", "taux": 3.9, "duree_max": "15 ans", "montant_max": "150000 TND", "assurance": "Garant parent"},
    {"type": "Liquidité Urg", "taux": 6.5, "duree_max": "3 ans", "montant_max": "50000 TND", "assurance": "Aucune"}
]

# Assistant rules and identity
ASSISTANT_PROFILE = {
    "nom": "Assistant Amen Bank",
    "role": "Conseiller financier virtuel",
    "ton": "professionnel, clair, empathique",
    "langue": "français",
    "instructions": [
        "Répondre de manière concise et sans jargon technique.",
        "Fournir des informations vérifiables et structurées.",
        "Utiliser les données bancaires fournies pour toute proposition.",
        "Si des montants sont extraits, inclure les calculs le cas échéant.",
        "Proposer des alternatives ou conseils connexes lorsque pertinent.",
        "Adopter un style rassurant et professionnel."
    ]
}

# Initialize Together client
client = Together(api_key=TOGETHER_API_KEY)

# Extraction helper
def extract_amounts(message: str):
    pattern = r"j[' ]ai\s*([0-9]+(?:\s*mille)?)\s*(dinars?)?.*acheter.*appartement\s*[àa]\s*([0-9]+(?:\s*mille)?)"
    m = re.search(pattern, message.lower())
    if not m:
        return None, None
    def parse_tnd(s: str) -> int:
        s = s.strip()
        return int(s.replace('mille', '').strip()) * 1000 if 'mille' in s else int(s)
    return parse_tnd(m.group(1)), parse_tnd(m.group(3))

# Main generation function
def generate_reply(message: str, user_context: str = "") -> str:
    # Extract variables
    apport, prix = extract_amounts(message)
    variables = {}
    if apport and prix:
        montant_pret = prix - apport
        variables = {"apport": apport, "prix": prix, "montant_pret": montant_pret}

    # Build metadata
    meta = {
        "assistant_profile": ASSISTANT_PROFILE,
        "bank_profile": BANKING_PROFILE,
        "account_types": ACCOUNT_TYPES,
        "loan_matrix": LOAN_MATRIX,
        "variables": variables,
        "contexte_client": user_context,
        "date": datetime.now().strftime('%Y-%m-%d %H:%M')
    }

    # Compose prompts
    system_content = (
        "Voicis les données de référence (JSON) :\n"
        f"{json.dumps(meta, ensure_ascii=False, indent=2)}"
    )
    messages = [
        {"role": "system", "content": system_content},
        {"role": "user", "content": message}
    ]

    # API call
    response = client.chat.completions.create(
        messages=messages,
        model=TOGETHER_MODEL,
        temperature=0.2,
        max_tokens=800,
        top_p=0.9,
        frequency_penalty=0.1
    )

    return response.choices[0].message.content