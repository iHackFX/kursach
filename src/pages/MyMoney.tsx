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
  IonRefresher,
  IonRefresherContent,
  IonItem,
  IonButton,
  IonLabel,
} from "@ionic/react";
import React, { useState } from "react";
import {
  add,
  cashOutline,
  refresh,
  trashBin,
  trendingDown,
  trendingUp,
  wallet,
} from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";
import { AddDataModal } from "../components/addDataModal";
import { Plugins } from "@capacitor/core";
interface DataArray {
  date: string;
  type: string;
  value: string;
}

const { Storage } = Plugins;

const MyMoney: React.FC = () => {
  const [showState, setShowState] = useState(false);
  const [data, setData] = useState("");
  const [keysData, setKeysData] = useState<Array<string>>([]);
  const [parsedData, setParsedData] = useState<Array<DataArray>>([]);

  async function keys() {
    const { keys } = await Storage.keys();
    console.log({ "Storage KEYS: ": keys });
    setKeysData(keys);
  }

  async function getItem(key: string) {
    const { value } = await Storage.get({ key: key });
    console.log({ key: key, value: JSON.parse(String(value)) });
    return value;
  }

  async function getItems(keys: Array<string>) {
    var data: Array<DataArray> = [];
    for (var i = 0; i < keys.length; i++) {
      var a = await getItem(keys[i]);
      data.push(...JSON.parse(String(a)).data);
    }
    // console.log(data);
    setParsedData(data);
  }

  async function clear() {
    await Storage.clear();
    console.log("Storage Cleared");
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    keys().finally(() =>
      getItems(keysData).finally(() => event.detail.complete())
    );
  }

  function doRefreshGo() {
    keys().finally(() => getItems(keysData));
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={wallet} /> Мои деньги
          </IonTitle>
          <IonButton
            expand="block"
            fill="outline"
            shape="round"
            slot="end"
            size="small"
            onClick={doRefreshGo}
          >
            <IonIcon icon={refresh} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent
            refreshingText={"Если ничего не появилось, попробуйте снова"}
          ></IonRefresherContent>
        </IonRefresher>
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
        {parsedData.length < 1 ? (
          <ExploreContainer name="Данных пока нет, попробуйте добавить новые или загрузите данные пару раз потянув пальцем вниз" />
        ) : (
          ""
        )}
        {parsedData
          ? parsedData.map((data, i) => {
              return (
                <IonItem key={i}>
                  <IonLabel slot="start">
                    <h2>{data.type}</h2>
                    <p>{data.date}</p>
                  </IonLabel>
                  <IonLabel>{data.value} р.</IonLabel>
                </IonItem>
              );
            })
          : ""}
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
          <IonFabButton onClick={() => clear()}>
            <IonIcon icon={trashBin} />
          </IonFabButton>
        </IonFabList>
      </IonFab>
    </IonPage>
  );
};

export default MyMoney;
