import type React from "react"
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
} from "@ionic/react"
import {
  peopleOutline,
  swapHorizontalOutline,
  shieldOutline,
  trendingUpOutline,
  pieChartOutline,
  warningOutline,
} from "ionicons/icons"
import "./Dashboard.css"
import NavbarAdmin from "../../../components/NavbarAdmin"

const Dashboard: React.FC = () => {
  const stats = [
    { title: "Utilisateurs Actifs", value: 1250, icon: peopleOutline },
    { title: "Transactions en Temps Réel", value: 356, icon: swapHorizontalOutline },
    { title: "Alertes de Sécurité", value: 5, icon: shieldOutline },
  ]

  const charts = [
    { title: "Charge du Système", icon: trendingUpOutline },
    { title: "Répartition des Rôles", icon: pieChartOutline },
  ]

  const alerts = ["Tentative de connexion suspecte détectée", "Service en panne depuis 5 minutes"]

  return (
    <IonPage>
      <IonHeader>
        <NavbarAdmin currentPage="Dashboard" />
      </IonHeader>
      <IonContent className="dashboard-content ion-padding">
        <IonGrid>
          <IonRow>
            {stats.map((stat, index) => (
              <IonCol size="4" key={index}>
                <IonCard className="dashboard-card stat-card">
                  <IonCardHeader>
                    <IonIcon icon={stat.icon} className="stat-icon" />
                    <IonCardTitle className="dashboard-card-title">{stat.title}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <p className="dashboard-stat">{stat.value.toLocaleString()}</p>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            {charts.map((chart, index) => (
              <IonCol size="6" key={index}>
                <IonCard className="dashboard-card chart-card">
                  <IonCardHeader>
                    <IonIcon icon={chart.icon} className="chart-icon" />
                    <IonCardTitle className="dashboard-card-title">{chart.title}</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="dashboard-chart">Graphique ici</div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            ))}
          </IonRow>
          <IonRow>
            <IonCol>
              <IonCard className="dashboard-card alert-card">
                <IonCardHeader>
                  <IonIcon icon={warningOutline} className="alert-icon" />
                  <IonCardTitle className="dashboard-card-title">Alertes Urgentes</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList className="dashboard-alert-list">
                    {alerts.map((alert, index) => (
                      <IonItem className="dashboard-alert-item" key={index}>
                        <IonIcon icon={warningOutline} slot="start" />
                        <IonLabel>{alert}</IonLabel>
                        <IonBadge color="danger" slot="end">
                          Urgent
                        </IonBadge>
                      </IonItem>
                    ))}
                  </IonList>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  )
}

export default Dashboard

