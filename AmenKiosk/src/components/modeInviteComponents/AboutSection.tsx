import type React from "react"
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol } from "@ionic/react"

const AboutSection: React.FC = () => {
  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>À propos d'Amen Bank</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <h2>Notre histoire</h2>
        <p>
          Fondée en 1967, Amen Bank est l'une des premières banques privées en Tunisie. Depuis plus de 50 ans, nous
          accompagnons nos clients dans leurs projets personnels et professionnels avec un engagement constant pour
          l'excellence et l'innovation.
        </p>

        <h2>Notre mission</h2>
        <p>
          Amen Bank a pour mission d'offrir des services financiers innovants, accessibles et sécurisés à l'ensemble de
          ses clients, qu'ils soient particuliers, professionnels ou entreprises. Nous nous engageons à créer de la
          valeur pour nos clients, nos actionnaires et la société tunisienne dans son ensemble, tout en respectant les
          principes de responsabilité sociale et environnementale.
        </p>

        <h2>Nos valeurs</h2>
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <h3>Excellence</h3>
              <p>Nous visons l'excellence dans tous nos services et interactions.</p>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <h3>Innovation</h3>
              <p>Nous encourageons l'innovation pour améliorer l'expérience bancaire.</p>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <h3>Intégrité</h3>
              <p>Nous agissons avec honnêteté, transparence et éthique.</p>
            </IonCol>
            <IonCol size="12" sizeMd="6">
              <h3>Responsabilité</h3>
              <p>Nous nous engageons à contribuer positivement à la société et à l'environnement.</p>
            </IonCol>
          </IonRow>
        </IonGrid>

        <h2>Chiffres clés</h2>
        <IonGrid>
          <IonRow>
            <IonCol size="6" sizeMd="3">
              <h3>1967</h3>
              <p>Année de création</p>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <h3>+80</h3>
              <p>Agences en Tunisie</p>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <h3>+1500</h3>
              <p>Collaborateurs</p>
            </IonCol>
            <IonCol size="6" sizeMd="3">
              <h3>+500K</h3>
              <p>Clients</p>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </IonCard>
  )
}

export default AboutSection

