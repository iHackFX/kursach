import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { analytics, refresh } from "ionicons/icons";
import {
  DoughnutChart,
  BarChart,
  LineChart,
  PieChart,
} from "../components/chart";
import { Plugins } from "@capacitor/core";
import { useEffect, useState } from "react";
import "./Tab3.css";
import { keys, getItem } from "../components/storage";
import DataArray from "../components/interfaces";
const { Storage } = Plugins;

function random(max: number) {
  return Math.floor(Math.random() * Math.floor(max));
}

const Tab3: React.FC = () => {
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
      var a : Array<DataArray> = await getItem(keys[i]);
      for(let i = 0; i < a.length; i++){
        data.push(parseFloat(a[i].value));
        let desc = a[i].date + " " + a[i].type;
        if(a[i].description !== null){
          desc += "\n" + a[i].description;
        }
        legendData.push(desc); 
      }
    }
    setParsedData(data);
    setParsedLegend(legendData);
  }

  function doRefreshGo() {
    keys(setKeysData).finally(() => {
      keysData.reverse();
      getItems(keysData);
    });
  }

  useEffect(() => {
    doRefreshGo();
  }, [true]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <IonIcon icon={analytics} /> Статистика
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
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large"></IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSlides pager={true} options={slideOpts}>
          <IonSlide>
            <PieChart
              data={parsedData.length >= 1 ? parsedData : defaultData}
              headers={parsedLegend.length >= 1 ? parsedLegend : defaultData.toString().split(",")}
            />
          </IonSlide>
          <IonSlide>
            <DoughnutChart
              data={parsedData.length >= 1 ? parsedData : defaultData}
              headers={parsedLegend.length >= 1 ? parsedLegend : defaultData.toString().split(",")}
            />
          </IonSlide>
          <IonSlide>
            <BarChart
              data={parsedData.length >= 1 ? parsedData : defaultData}
              headers={parsedLegend.length >= 1 ? parsedLegend : defaultData.toString().split(",")}
              label={"Дата"}
            />
          </IonSlide>
          <IonSlide>
            <LineChart
              data={parsedData.length >= 1 ? parsedData : defaultData}
              headers={parsedLegend.length >= 1 ? parsedLegend : defaultData.toString().split(",")}
            />
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
