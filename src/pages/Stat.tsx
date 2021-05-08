import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import {
  accessibility,
  bag,
  call,
  ellipsisHorizontal,
  home,
  pieChartOutline,
  refresh,
  restaurant,
} from "ionicons/icons";
import { PieChart } from "../components/chart";
import { useEffect, useState } from "react";
import { keys, getItem } from "../components/storage";
import DataArray from "../components/interfaces";
import ExploreContainer from "../components/ExploreContainer";

function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const Tab3: React.FC = () => {
  const [getType, setGetType] = useState("Всё");
  const [keysData, setKeysData] = useState<Array<string>>([]);
  const [parsedData, setParsedData] = useState<Array<number>>([]);
  var defaultData = [];
  for (var i = 0; i < 15; i++) {
    defaultData.push(random(3000));
  }

  async function getItems() {
    let data: Array<DataArray> = await getItem("data");
    let arrayOfValues: Array<number> = [0,0,0,0,0,0];
    for (let i = 0; i < data.length; i++) {
      const el = data[i];
      if (el.type === "Расход") {
        switch (el.typeT) {
          case 'Супермаркеты':
            arrayOfValues[0] += parseInt(el.value);
            break;
          case 'Всё для дома':
            arrayOfValues[1] += parseInt(el.value);
            break;
          case 'Услуги связи':
            arrayOfValues[2] += parseInt(el.value);
            break;
          case 'Одежда и аксессуары':
            arrayOfValues[3] += parseInt(el.value);
            break;
          case 'Рестораны и кафе':
            arrayOfValues[4] += parseInt(el.value);
            break;
          case 'Прочее':
            arrayOfValues[5] += parseInt(el.value);
            break;
        }
      }
    }
    setParsedData(arrayOfValues);
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    keys(setKeysData).finally(() =>
      getItems().finally(() => event.detail.complete())
    );
  }

  function doRefreshGo() {
    keys(setKeysData).finally(() => {
      keysData.reverse();
      getItems();
    });
  }

  useEffect(() => {
    doRefreshGo();
  }, [getType]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={pieChartOutline} /> Статистика
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
        {parsedData.length > 1 ? (
          <IonCard>
            <PieChart
              data={parsedData}
              headers={[
                "Супермаркеты",
                "Всё для дома",
                "Услуги связи",
                "Одежда и аксессуары",
                "Рестораны и кафе",
                "Прочее"
              ]}
            />
          </IonCard>
        ) : (
          <ExploreContainer name="Данных пока нет, попробуйте добавить новые или загрузите данные, потянув пальцем вниз" />
        )}
        {parsedData.length > 1 ? (
          <IonCard>
            <IonItem>
              <IonIcon slot="start" icon={bag}></IonIcon>
              <IonLabel slot="start">Супермаркеты</IonLabel>
              <IonLabel>{parsedData[0]} р.</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={home}></IonIcon>
              <IonLabel slot="start">Всё для дома</IonLabel>
              <IonLabel>{parsedData[1]} р.</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={call}></IonIcon>
              <IonLabel slot="start">Услуги связи</IonLabel>
              <IonLabel>{parsedData[2]} р.</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={accessibility}></IonIcon>
              <IonLabel slot="start">Одежда и аксессуары</IonLabel>
              <IonLabel>{parsedData[3]} р.</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={restaurant}></IonIcon>
              <IonLabel slot="start">Рестораны и кафе</IonLabel>
              <IonLabel>{parsedData[4]} р.</IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={ellipsisHorizontal}></IonIcon>
              <IonLabel slot="start">Прочее</IonLabel>
              <IonLabel>{parsedData[5]} р.</IonLabel>
            </IonItem>
          </IonCard>
        ) : (
          ""
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
