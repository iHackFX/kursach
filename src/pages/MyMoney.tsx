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
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { add, refresh, trendingDown, trendingUp, wallet } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import ExploreContainer from "../components/ExploreContainer";
import { AddDataModal } from "../components/addDataModal";
import DataArray from "../components/interfaces";
import ActionSheet from "../components/ActionSheet";
import { getItem, keys } from "../components/storage";

interface MyMoney{
  showStartPage: boolean;
}

const MyMoney: React.FC<MyMoney> = ({showStartPage}) => {
  const [showState, setShowState] = useState(false);
  const [data, setData] = useState("");
  const [getType, setGetType] = useState("Всё");
  const [showActionSheet, setShowActionSheet] = useState("");
  const [keysData, setKeysData] = useState<Array<string>>([]);
  const [parsedData, setParsedData] = useState<Array<DataArray>>([]);

  async function getItems(keys: Array<string>) {
    var data: Array<DataArray> = [];
    for (var i = 0; i < keys.length; i++) {
      var a: Array<DataArray> = await getItem(keys[i]);
      if (a.length > 0) {
        if (getType === "Доходы") {
          for (let j = 0; j < a.length; j++) {
            const element = a[j];
            if (element.type === "Доход") {
              data.push(element);
            }
          }
        } else if (getType === "Расходы") {
          for (let j = 0; j < a.length; j++) {
            const element = a[j];
            if (element.type === "Расход") {
              data.push(element);
            }
          }
        } else {
          data.push(...a);
        }
      }
    }
    setParsedData(data);
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    keys(setKeysData).finally(() =>
      getItems(keysData).finally(() => event.detail.complete())
    );
  }

  function doRefreshGo() {
    keys(setKeysData).finally(() => getItems(keysData));
  }  
  
  useEffect(() => {
    doRefreshGo();
  }, [getType, showActionSheet, showState, showStartPage]);
  
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
        <IonSegment
          onIonChange={(e) => {
            setGetType(e.detail.value as string);
          }}
          value={getType}
        >
          <IonSegmentButton value="Всё">
            <IonLabel>Всё</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Доходы">
            <IonLabel>Доходы</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="Расходы">
            <IonLabel>Расходы</IonLabel>
          </IonSegmentButton>
        </IonSegment>
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
          <ExploreContainer name="Данных пока нет, попробуйте добавить новые или загрузите данные, потянув пальцем вниз" />
        ) : (
          ""
        )}
        {parsedData
          ? parsedData.map((data, i) => {
              return (
                <IonItem
                  key={i}
                  onClick={() => {
                    setShowActionSheet(data.uuid);
                    setTimeout(() => {
                      doRefreshGo();
                    }, 3000);
                  }}
                >
                  <IonLabel slot="start">
                  <h2>{data.type}</h2>
                    {data.description != undefined &&
                    data.description.length > 1 ? (
                      <h3>Описание: {data.description}</h3>
                    ) : (
                      ""
                    )}
                    {console.log(data.description)}
                    {data.typeT != undefined && data.typeT.length > 1 ? (
                      <h3>Тип: {data.typeT}</h3>
                    ) : (
                      ""
                    )}
                    <p>{data.date}</p>
                  </IonLabel>
                  <IonLabel>{data.value} р.</IonLabel>
                  <ActionSheet
                    setShowActionSheet={setShowActionSheet}
                    showActionSheet={showActionSheet}
                    uuid={data.uuid}
                    keyToDelete={data.date}
                  ></ActionSheet>
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
        </IonFabList>
      </IonFab>
    </IonPage>
  );
};

export default MyMoney;
