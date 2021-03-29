import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { add, trendingDown, trendingUp, wallet } from "ionicons/icons";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { AddDataModal } from "../components/addDataModal";
import { KeyboardStyle, Plugins } from "@capacitor/core";

const { Storage } = Plugins;

const Tab1: React.FC = () => {
  const [showState, setShowState] = useState(false);
  const [data, setData] = useState("");
  // const [parsedData, setParsedData] = useState<Object>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={wallet} /> Мои деньги
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"></IonTitle>
          </IonToolbar>
        </IonHeader>
        <AddDataModal
          setShowState={setShowState}
          showState={showState}
          typeOfData={data}
        />
        {1 > 0
        ? "" 
        : <ExploreContainer name="Денег пока нет, добавьте их чтобы увидеть информацию о доходах и расходах" />
        }
      </IonContent>
      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton>
          <IonIcon icon={add} />
        </IonFabButton>
        <IonFabList side="top">
          <IonFabButton
            onClick={() => {
              setData("Расход");
              setShowState(true);
            }}
          >
            <IonIcon icon={trendingDown} />
          </IonFabButton>
          <IonFabButton
            onClick={() => {
              setData("Доход");
              setShowState(true);
            }}
          >
            <IonIcon icon={trendingUp} />
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonPage>
  );
};

export default Tab1;
