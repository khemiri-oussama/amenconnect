"use client"
import type React from "react"
import { useState } from "react"
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonSelect,
  IonSelectOption,
  IonText,
  IonAccordion,
  IonAccordionGroup,
  IonContent,
} from "@ionic/react"
import {
  callOutline,
  mailOutline,
  locationOutline,
  timeOutline,
  logoFacebook,
  logoTwitter,
  logoLinkedin,
  logoInstagram,
  sendOutline,
} from "ionicons/icons"

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    branch: "tunis",
  })

  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    setFormSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormSubmitted(false)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        branch: "tunis",
      })
    }, 3000)
  }

  const branches = [
    { id: "tunis", name: "Tunis - Siège", address: "Avenue Mohamed V, Tunis", phone: "+216 71 148 000" },
    { id: "sousse", name: "Sousse", address: "Avenue Habib Bourguiba, Sousse", phone: "+216 73 200 100" },
    { id: "sfax", name: "Sfax", address: "Route de Gabès, Sfax", phone: "+216 74 402 200" },
    { id: "monastir", name: "Monastir", address: "Avenue Habib Bourguiba, Monastir", phone: "+216 73 500 300" },
    { id: "nabeul", name: "Nabeul", address: "Avenue Habib Thameur, Nabeul", phone: "+216 72 232 100" },
  ]

  const faqs = [
    {
      question: "Comment puis-je ouvrir un compte chez Amen Bank ?",
      answer:
        "Pour ouvrir un compte, vous pouvez vous rendre dans l'agence la plus proche avec une pièce d'identité, un justificatif de domicile et un montant initial de dépôt. Vous pouvez également commencer le processus en ligne sur notre site web.",
    },
    {
      question: "Quels sont les horaires d'ouverture des agences ?",
      answer:
        "Nos agences sont généralement ouvertes du lundi au vendredi de 8h30 à 16h30. Certaines agences peuvent avoir des horaires étendus ou être ouvertes le samedi matin. Veuillez consulter la page de votre agence locale pour les horaires spécifiques.",
    },
    {
      question: "Comment puis-je signaler une carte perdue ou volée ?",
      answer:
        "En cas de perte ou de vol de votre carte, veuillez contacter immédiatement notre service client au +216 71 148 000, disponible 24h/24 et 7j/7, ou bloquer votre carte via l'application mobile Amen Bank.",
    },
  ]

  return (
    <IonContent>
      <IonGrid>
        <IonRow>
          <IonCol size="12" sizeMd="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Contactez-nous</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {formSubmitted ? (
                  <div className="success-message">
                    <IonIcon icon={sendOutline} className="success-icon" />
                    <h3>Message envoyé avec succès!</h3>
                    <p>Nous vous répondrons dans les plus brefs délais.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <IonItem>
                      <IonLabel position="floating">Nom complet</IonLabel>
                      <IonInput
                        value={formData.name}
                        onIonChange={(e) => handleInputChange("name", e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Email</IonLabel>
                      <IonInput
                        type="email"
                        value={formData.email}
                        onIonChange={(e) => handleInputChange("email", e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Téléphone</IonLabel>
                      <IonInput
                        type="tel"
                        value={formData.phone}
                        onIonChange={(e) => handleInputChange("phone", e.detail.value!)}
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Agence concernée</IonLabel>
                      <IonSelect
                        value={formData.branch}
                        onIonChange={(e) => handleInputChange("branch", e.detail.value)}
                      >
                        {branches.map((branch) => (
                          <IonSelectOption key={branch.id} value={branch.id}>
                            {branch.name}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Sujet</IonLabel>
                      <IonInput
                        value={formData.subject}
                        onIonChange={(e) => handleInputChange("subject", e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="floating">Message</IonLabel>
                      <IonTextarea
                        rows={4}
                        value={formData.message}
                        onIonChange={(e) => handleInputChange("message", e.detail.value!)}
                        required
                      />
                    </IonItem>

                    <IonButton expand="block" type="submit" className="ion-margin-top">
                      Envoyer
                    </IonButton>
                  </form>
                )}
              </IonCardContent>
            </IonCard>
          </IonCol>

          <IonCol size="12" sizeMd="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Nos coordonnées</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  <IonItem lines="none">
                    <IonIcon icon={locationOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h2>Adresse</h2>
                      <p>Avenue Mohamed V, 1002 Tunis, Tunisie</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem lines="none">
                    <IonIcon icon={callOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h2>Téléphone</h2>
                      <p>+216 71 148 000</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem lines="none">
                    <IonIcon icon={mailOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h2>Email</h2>
                      <p>contact@amenbank.com</p>
                    </IonLabel>
                  </IonItem>

                  <IonItem lines="none">
                    <IonIcon icon={timeOutline} slot="start" color="primary" />
                    <IonLabel>
                      <h2>Horaires d'ouverture</h2>
                      <p>Lundi - Vendredi: 8h30 - 16h30</p>
                      <p>Samedi: 8h30 - 12h00</p>
                    </IonLabel>
                  </IonItem>
                </IonList>

                <div className="social-media">
                  <h3>Suivez-nous</h3>
                  <div className="social-icons">
                    <IonButton fill="clear" href="https://facebook.com" target="_blank">
                      <IonIcon icon={logoFacebook} />
                    </IonButton>
                    <IonButton fill="clear" href="https://twitter.com" target="_blank">
                      <IonIcon icon={logoTwitter} />
                    </IonButton>
                    <IonButton fill="clear" href="https://linkedin.com" target="_blank">
                      <IonIcon icon={logoLinkedin} />
                    </IonButton>
                    <IonButton fill="clear" href="https://instagram.com" target="_blank">
                      <IonIcon icon={logoInstagram} />
                    </IonButton>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>

            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Questions fréquentes</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonAccordionGroup>
                  {faqs.map((faq, index) => (
                    <IonAccordion key={index}>
                      <IonItem slot="header">
                        <IonLabel>{faq.question}</IonLabel>
                      </IonItem>
                      <div slot="content" className="ion-padding">
                        <IonText>{faq.answer}</IonText>
                      </div>
                    </IonAccordion>
                  ))}
                </IonAccordionGroup>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <style jsx>{`
        .success-message {
          text-align: center;
          padding: 2rem;
        }
        
        .success-icon {
          font-size: 3rem;
          color: var(--ion-color-primary);
          margin-bottom: 1rem;
        }
        
        .social-media {
          margin-top: 2rem;
          text-align: center;
        }
        
        .social-icons {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .social-icons ion-button {
          --padding-start: 0.5rem;
          --padding-end: 0.5rem;
        }
        
        .social-icons ion-icon {
          font-size: 1.5rem;
        }
      `}</style>
    </IonContent>
  )
}

export default ContactUs

