import {
  IonButton,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { RefresherEventDetail } from "@ionic/core";
import { pieChartOutline, refresh } from "ionicons/icons";
import {
  DoughnutChart,
  BarChart,
  LineChart,
  PieChart,
} from "../components/chart";
import { useEffect, useState } from "react";
import { keys, getItem } from "../components/storage";
import DataArray from "../components/interfaces";

function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const Tab3: React.FC = () => {
  const [getType, setGetType] = useState("Всё");
  const [keysData, setKeysData] = useState<Array<string>>([]);
  const [parsedData, setParsedData] = useState<Array<number>>([]);
  const [parsedLegend, setParsedLegend] = useState<Array<string>>([]);
  const slideOpts = {
    initialSlide: 0,
    speed: 400,
  };
  var defaultData = [];
  for (var i = 0; i < 15; i++) {
    defaultData.push(random(3000));
  }

  async function getItems(keys: Array<string>) {
    var data: Array<number> = [];
    var legendData: Array<string> = [];
    for (var i = 0; i < keys.length; i++) {
      var a: Array<DataArray> = await getItem(keys[i]);
      if (a.length > 0) {
        if (getType === "Доходы") {
          for (let j = 0; j < a.length; j++) {
            const element = a[j];
            if (element.type === "Доход") {
              data.push(parseFloat(element.value));
              let desc = a[j].date + " " + a[j].type;
              legendData.push(desc);
            }
          }
        } else if (getType === "Расходы") {
          for (let j = 0; j < a.length; j++) {
            const element = a[j];
            if (element.type === "Расход") {
              data.push(parseFloat(element.value));
              let desc = a[j].date + " " + a[j].type;
              legendData.push(desc);
            }
          }
        } else {
          for (let i = 0; i < a.length; i++) {
            data.push(parseFloat(a[i].value));
            let desc = a[i].date + " " + a[i].type;
            legendData.push(desc);
          }
        }
      }
    }
    setParsedData(data);
    setParsedLegend(legendData);
  }

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    keys(setKeysData).finally(() =>
      getItems(keysData).finally(() => event.detail.complete())
    );
  }

  function doRefreshGo() {
    keys(setKeysData).finally(() => {
      keysData.reverse();
      getItems(keysData);
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
          <IonCard>
            <PieChart
              data={parsedData.length >= 1 ? parsedData : defaultData}
              headers={
                parsedLegend.length >= 1
                  ? parsedLegend
                  : defaultData.toString().split(",")
              }
            />
          </IonCard>
          <IonCard>
            <DoughnutChart
              data={parsedData.length >= 1 ? parsedData : defaultData}
              headers={
                parsedLegend.length >= 1
                  ? parsedLegend
                  : defaultData.toString().split(",")
              }
            />
          </IonCard>
          <IonCard>
            <BarChart
              data={parsedData.length >= 1 ? parsedData : defaultData}
              headers={
                parsedLegend.length >= 1
                  ? parsedLegend
                  : defaultData.toString().split(",")
              }
              label={"Дата"}
            />
          </IonCard>
          <IonCard>
            <LineChart
              data={parsedData.length >= 1 ? parsedData : defaultData}
              headers={
                parsedLegend.length >= 1
                  ? parsedLegend
                  : defaultData.toString().split(",")
              }
            />
          </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
