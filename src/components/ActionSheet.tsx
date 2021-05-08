import { IonActionSheet } from "@ionic/react";
import { trash } from "ionicons/icons";
import React, { SetStateAction } from "react";
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
          handler: () => deleteData(uuid),
        },
      ]}
    ></IonActionSheet>
  );
};
export default ActionSheet;
