import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { moon, settings } from "ionicons/icons";
import "./Tab2.css";

const Settings: React.FC = () => {
  function toggleDarkMode() {
    document.body.classList.toggle("dark");
    
    // document.documentElement.classList.toggle("md");
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={settings} /> Настройки
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList class="theme-list" lines="full">
          <IonItem>
            <IonIcon
              slot="start"
              icon={moon}
              // class="component-icon component-icon-dark"
            ></IonIcon>
            <IonLabel>Тёмная тема</IonLabel>
            <IonToggle
              slot="end"
              checked={window.matchMedia('(prefers-color-scheme: dark)').matches}
              onIonChange={() => toggleDarkMode()}
            ></IonToggle>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
