import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToast,
  IonToggle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { moon, settingsOutline, trash } from "ionicons/icons";
import { platform } from "node:os";
import { useState } from "react";
import { clearStorage } from "../components/storage";

const Settings: React.FC = () => {
  const [showToast, setShowToast] = useState(false);
  const [theme, setTheme] = useState(
    document.body.getAttribute("color-theme") === "dark"
  );
  function toggleDarkMode() {
    if (document.body.getAttribute("color-theme") !== "dark") {
      document.body.setAttribute("color-theme", "dark");
      setTheme(true);
    } else {
      document.body.setAttribute("color-theme", "light");
      setTheme(false);
    }
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={settingsOutline} /> Настройки
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        {isPlatform("android") || isPlatform("capacitor") ?
          <IonItem>
            <IonIcon slot="start" icon={moon}></IonIcon>
            <IonLabel>Тёмная тема</IonLabel>
            <IonToggle
              slot="end"
              checked={theme}
              onIonChange={() => toggleDarkMode()}
            ></IonToggle>
          </IonItem>
        : ""}
        <IonList>
          <IonItem
            onClick={() => {
              clearStorage();
            }}
          >
            <IonIcon slot="start" icon={trash}></IonIcon>
            <IonLabel>Очистить данные</IonLabel>
            <IonToast
              isOpen={showToast}
              onDidDismiss={() => setShowToast(false)}
              message="Данные очищены!"
              duration={300}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
