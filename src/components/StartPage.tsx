import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonItem,
  IonList,
  IonModal,
} from "@ionic/react";
import { CSSProperties, SetStateAction } from "react";

interface StartPage {
  showModal: boolean;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
}

const textCenter : CSSProperties = { 
  textAlign: 'center',
}

const StartPage: React.FC<StartPage> = ({ showModal, setShowModal }) => {
  return (
    <IonModal isOpen={showModal} cssClass="my-custom-class">
      <IonContent>
        <IonList>
          <IonItem>
            <h1 style={textCenter}>
              Добро пожаловать в приложение по учету ваших расходов и доходов
            </h1>
          </IonItem>
        </IonList>
        <IonFab
          vertical="center"
          horizontal="center"
          slot="fixed"
          onClick={() => setShowModal(false)}
        >
          <IonButton>Старт</IonButton>
        </IonFab>
      </IonContent>
    </IonModal>
  );
};

export default StartPage;
