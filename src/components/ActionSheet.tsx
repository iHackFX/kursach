import { IonActionSheet, IonToast } from "@ionic/react";
import { information, trash } from "ionicons/icons";
import React, { SetStateAction, useState } from "react";
import { deleteData } from "./storage";

interface ActionProps {
  uuid: string;
  keyToDelete: string;
  showActionSheet: string;
  setShowActionSheet: React.Dispatch<SetStateAction<string>>;
}

const ActionSheet: React.FC<ActionProps> = ({
  uuid,
  keyToDelete,
  showActionSheet,
  setShowActionSheet,
}) => {
  const [showToast, setShowToast] = useState(false);
  return (
    <IonActionSheet
      isOpen={showActionSheet == uuid}
      onDidDismiss={() => setShowActionSheet("")}
      cssClass="my-custom-class"
      buttons={[
        {
          text: "Удалить",
          role: "destructive",
          icon: trash,
          handler: () => {
            deleteData(keyToDelete, uuid);
            setShowToast(true);
          },
        },
      ]}
    >
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message="Данные удалены! Пожалуйста, обновите данные."
        duration={2000}
      />
    </IonActionSheet>
  );
};
export default ActionSheet;
