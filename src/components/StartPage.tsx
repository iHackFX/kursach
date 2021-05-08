import {
  IonButton,
  IonContent,
  IonFab,
  IonModal,
} from "@ionic/react";
import React, { CSSProperties, SetStateAction } from "react";

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
        <h1 style={
          {
            textAlign: "center"
          }
        }>Добро пожаловать в приложение по учету ваших расходов и доходов</h1>
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
