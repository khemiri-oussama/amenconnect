"use client";
import { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonInput,
  IonLabel,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonToast,
} from "@ionic/react";
import {
  cardOutline,
  personOutline,
  calendarOutline,
  lockClosedOutline,
  cashOutline,
  businessOutline,
  chevronBackOutline,
} from "ionicons/icons";
import "./payment-form.css";
import { useAuth, type Carte, type Compte } from "../AuthContext";
import { useCarte } from "../CarteContext";

interface CreditCardTransaction {
  _id: string;
  transactionDate: string;
  amount: number;
  currency: string;
  merchant: string;
  status: string;
  description: string;
}

const PaymentForm: React.FC = () => {
  const { profile,refreshProfile } = useAuth();

  // UI & functional states for payment form, card details and navigation.
  const [activeTab, setActiveTab] = useState("operations");
  const [isCardLocked, setIsCardLocked] = useState(false);
  const [isCardNumberVisible, setIsCardNumberVisible] = useState(false);
  const [cardDetails, setCardDetails] = useState<Carte | null>(null);
  const [accountDetails, setAccountDetails] = useState<Compte | null>(null);
  const [transactions, setTransactions] = useState<CreditCardTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New state for card navigation.
  const [allCards, setAllCards] = useState<Carte[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null);

  // UI states for form submission.
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);
  if(!profile) {
    refreshProfile();
}
  // Derive default user ID from the profile.
  const defaultUserId = profile?.user._id ;

  // Get the default card ID from the profile's cartes array.
  const defaultCardId =
    profile?.cartes && profile.cartes.length > 0
      ? profile.cartes[0]._id
      : "";

  // Initialize form data.
  const [formData, setFormData] = useState({
    cardId: defaultCardId,
    userId: defaultUserId,
    cardNumber: "",
    cardName: "",
    expMonth: "",
    expYear: "",
    // Although the CVC field is kept for UX, it isn’t sent to the API.
    cvc: "",
    amount: "",
    merchantType: "",
  });

  // Update form data for controlled inputs.
  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Populate card details from profile.
  useEffect(() => {
    if (profile && profile.cartes && profile.cartes.length > 0) {
      // Save all cards.
      setAllCards(profile.cartes);

      // Use the first card as the default.
      const cardFromProfile = profile.cartes[0];
      setCardDetails(cardFromProfile);
      // Update the state whether the card is locked.
      setIsCardLocked(cardFromProfile.cardStatus?.toLowerCase() !== "active");
      setTransactions(cardFromProfile.creditCardTransactions || []);

      // Find the associated account.
      const associatedAccount = profile.comptes.find(
        (compte) => compte._id === cardFromProfile.comptesId
      );
      setAccountDetails(associatedAccount || null);
    }
    setIsLoading(false);
  }, [profile]);

  // When cardDetails are available, update the form values.
  useEffect(() => {
    if (cardDetails) {
      // Assuming ExpiryDate is stored as "MM/YY"
      const [expMonth, expYear] = cardDetails.ExpiryDate.split("/");
      setFormData((prev) => ({
        ...prev,
        cardId: cardDetails._id,
        cardNumber: cardDetails.CardNumber,
        cardName: cardDetails.CardHolder,
        expMonth: expMonth || "",
        expYear: expYear || "",
      }));
    }
  }, [cardDetails]);

  // Optionally show a loading spinner if profile is not loaded.
  if (!profile) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div className="ion-text-center">
            <IonSpinner name="crescent" />
            <p>Chargement des données...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Check if the card is blocked.
    if (isCardLocked) {
      setError("Votre carte est bloquée. Le paiement ne peut pas être effectué.");
      setLoading(false);
      return;
    }

    // Validate input values against stored card data.
    if (cardDetails) {
      // Validate card number and card holder name.
      if (
        formData.cardNumber !== cardDetails.CardNumber ||
        formData.cardName !== cardDetails.CardHolder
      ) {
        setError("Les informations de carte saisies ne correspondent pas aux données enregistrées.");
        setLoading(false);
        return;
      }

      // Validate expiry date.
      const storedExpiry = cardDetails.ExpiryDate.trim(); // e.g., "12/29"
      const enteredExpiry = `${formData.expMonth.trim()}/${formData.expYear.trim()}`;
      if (enteredExpiry !== storedExpiry) {
        setError("La date d'expiration saisie ne correspond pas aux données enregistrées.");
        setLoading(false);
        return;
      }
    }

    try {
      // Process the payment.
      const paymentPayload = {
        cardId: formData.cardId,
        user: formData.userId,
        cardNumber: formData.cardNumber,
        cardName: formData.cardName,
        expMonth: formData.expMonth,
        expYear: formData.expYear,
        amount: parseFloat(formData.amount),
        merchantType: formData.merchantType,
      };

      const paymentResponse = await fetch("/api/payments/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      if (!paymentResponse.ok) {
        throw new Error("Le traitement du paiement a échoué.");
      }

      // Update user's budget category.
      const budgetPayload = {
        userId: formData.userId,
        merchantType: formData.merchantType,
        amount: parseFloat(formData.amount),
      };

      const budgetResponse = await fetch("/api/budget/updateBudget", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budgetPayload),
      });

      if (!budgetResponse.ok) {
        console.error("La mise à jour du budget utilisateur a échoué.");
      }

      setShowToast(true);
    } catch (error) {
      console.error("Erreur lors du paiement :", error);
      setError("Une erreur s'est produite lors du traitement du paiement.");
    } finally {
      setLoading(false);
    }
  };

  // Generate month options ("01" to "12").
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0");
    return (
      <IonSelectOption key={month} value={month}>
        {month}
      </IonSelectOption>
    );
  });

  // Generate year options (current year to current year + 9).
  const yearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = (new Date().getFullYear() + i).toString().slice(-2);
    return (
      <IonSelectOption key={year} value={year}>
        {year}
      </IonSelectOption>
    );
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" fill="clear">
            <IonIcon icon={chevronBackOutline} />
          </IonButton>
          <IonTitle>Paiement</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard className="payment-card">
          <IonCardHeader>
            <IonCardTitle>Paiement</IonCardTitle>
            <IonCardSubtitle>Vérifiez ou modifiez vos informations de carte</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <form onSubmit={handleSubmit}>
              <IonGrid>
                {/* Card Number */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="full" className="payment-item">
                      <IonIcon icon={cardOutline} slot="start" color="medium" />
                      <IonLabel position="floating">Numéro de carte</IonLabel>
                      <IonInput
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onIonChange={(e) => handleChange("cardNumber", e.detail.value!)}
                        required
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                {/* Card Holder Name */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="full" className="payment-item">
                      <IonIcon icon={personOutline} slot="start" color="medium" />
                      <IonLabel position="floating">Nom du titulaire</IonLabel>
                      <IonInput
                        type="text"
                        placeholder="Jean Dupont"
                        value={formData.cardName}
                        onIonChange={(e) => handleChange("cardName", e.detail.value!)}
                        required
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                {/* Expiry Date and CVC */}
                <IonRow>
                  <IonCol size="4">
                    <IonItem lines="full" className="payment-item">
                      <IonIcon icon={calendarOutline} slot="start" color="medium" />
                      <IonLabel position="floating">Mois</IonLabel>
                      <IonSelect
                        placeholder="MM"
                        onIonChange={(e) => handleChange("expMonth", e.detail.value)}
                        required
                        >
                        {monthOptions}
                      </IonSelect>
                    </IonItem>
                  </IonCol>

                  <IonCol size="4">
                    <IonItem lines="full" className="payment-item">
                      <IonLabel position="floating">Année</IonLabel>
                      <IonSelect
                        placeholder="AA"
                        onIonChange={(e) => handleChange("expYear", e.detail.value)}
                      >
                        {yearOptions}
                      </IonSelect>
                    </IonItem>
                  </IonCol>

                  <IonCol size="4">
                    <IonItem lines="full" className="payment-item">
                      <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
                      <IonLabel position="floating">CVC</IonLabel>
                      <IonInput
                        type="text"
                        placeholder="123"
                        maxlength={4}
                        value={formData.cvc}
                        onIonChange={(e) => handleChange("cvc", e.detail.value!)}
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                {/* Payment Amount */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="full" className="payment-item">
                      <IonIcon icon={cashOutline} slot="start" color="medium" />
                      <IonLabel position="floating">Montant</IonLabel>
                      <IonInput
                        type="number"
                        placeholder="0.00"
                        min="1"
                        step="0.50"
                        value={formData.amount}
                        onIonChange={(e) => handleChange("amount", e.detail.value!)}
                        required
                      />
                    </IonItem>
                  </IonCol>
                </IonRow>

                {/* Merchant Type */}
                <IonRow>
                  <IonCol size="12">
                    <IonItem lines="full" className="payment-item">
                      <IonIcon icon={businessOutline} slot="start" color="medium" />
                      <IonLabel position="floating">Type de marchand</IonLabel>
                      <IonSelect
                        placeholder="Sélectionnez un type"
                        value={formData.merchantType}
                        onIonChange={(e) => handleChange("merchantType", e.detail.value)}
                      >
                        <IonSelectOption value="shopping">Shopping</IonSelectOption>
                        <IonSelectOption value="food">Alimentation</IonSelectOption>
                        <IonSelectOption value="entertainment">Loisirs</IonSelectOption>
                        <IonSelectOption value="education">Éducation</IonSelectOption>
                        <IonSelectOption value="travel">Voyage</IonSelectOption>
                        <IonSelectOption value="utilities">Services</IonSelectOption>
                        <IonSelectOption value="Autre">Autre</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonCol>
                </IonRow>

                <IonRow className="ion-margin-top">
                  <IonCol size="12">
                    <IonButton
                      expand="block"
                      className="payment-button"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <IonSpinner name="crescent" className="spinner-margin" />
                          Traitement...
                        </>
                      ) : (
                        "Payer maintenant"
                      )}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </form>
          </IonCardContent>
        </IonCard>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={`Paiement de ${formData.amount} TND au marchand ${formData.merchantType} effectué avec succès!`}
          duration={3000}
          position="top"
          color="success"
        />

        {error && (
          <div className="ion-padding">
            <p style={{ color: "red" }}>{error}</p>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default PaymentForm;
