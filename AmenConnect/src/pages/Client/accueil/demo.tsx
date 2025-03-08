import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import JitsiMeetComponent from '../../../components/JitsiMeetComponent';

const demo: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Video Conference Demo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* Place the video component inside a container */}
        <div style={{ height: '100%', padding: '0 10px' }}>
          <JitsiMeetComponent />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default demo;
