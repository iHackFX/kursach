import { FilesystemDirectory, Toast } from "@capacitor/core";
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
import {
  cloudDownload,
  download,
  moon,
  settingsOutline,
  trash,
} from "ionicons/icons";
import { useState } from "react";
import {
  clearStorage,
  exportData,
  importData,
  updateItem,
} from "../components/storage";

const Settings: React.FC = () => {
  const [showToast, setShowToast] = useState("");
  const [theme, setTheme] = useState(
    document.body.getAttribute("color-theme") === "dark"
  );
  /**
   * Смена тёмной темы
   */
  function toggleDarkMode() {
    if (document.body.getAttribute("color-theme") !== "dark") {
      document.body.setAttribute("color-theme", "dark");
      setTheme(true);
      updateItem("darkTheme", true);
    } else {
      document.body.setAttribute("color-theme", "light");
      setTheme(false);
      updateItem("darkTheme", false);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <IonIcon icon={settingsOutline} /> Настройки
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonList>
          <IonItem
            onClick={() => {
              setShowToast("export");
              exportData();
            }}
          >
            <IonIcon slot="start" icon={download}></IonIcon>
            <IonLabel>Экспортировать данные</IonLabel>
            <IonToast
              isOpen={showToast === "export"}
              onDidDismiss={() => setShowToast("")}
              message={
                isPlatform("capacitor")
                  ? "Файл создан в " + FilesystemDirectory.Documents + " !"
                  : "Файл скачан"
              }
              duration={300}
            />
          </IonItem>
          <IonItem
            onClick={() => {
              importData();
            }}
          >
            <IonIcon slot="start" icon={cloudDownload}></IonIcon>
            <IonLabel>Импортировать данные</IonLabel>
          </IonItem>
          {isPlatform("capacitor") ? (
            <IonItem>
              <IonIcon slot="start" icon={moon}></IonIcon>
              <IonLabel>Тёмная тема</IonLabel>
              <IonToggle
                slot="end"
                checked={theme}
                onIonChange={() => toggleDarkMode()}
              ></IonToggle>
            </IonItem>
          ) : (
            ""
          )}
          <IonItem
            onClick={() => {
              clearStorage();
              setShowToast("delete");
            }}
          >
            <IonIcon slot="start" icon={trash}></IonIcon>
            <IonLabel>Очистить данные</IonLabel>
            <IonToast
              isOpen={showToast === "delete"}
              onDidDismiss={() => setShowToast("")}
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
