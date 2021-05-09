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
  isPlatform,
  IonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import {
  add,
  qrCode,
  refresh,
  trendingDown,
  trendingUp,
  wallet,
} from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import ExploreContainer from "../components/ExploreContainer";
import { AddDataModal } from "../components/addDataModal";
import DataArray from "../components/interfaces";
import ActionSheet from "../components/ActionSheet";
import { getItemsByType, keys } from "../components/storage";
import {
  BarcodeScanner,
  BarcodeScannerOriginal,
  BarcodeScanResult,
} from "@ionic-native/barcode-scanner";
import { Toast } from "@capacitor/core";

interface MyMoney {
  showStartPage: boolean;
}
interface ToastData {
  show: boolean;
  text: string;
  duration: number;
}

const MyMoney: React.FC<MyMoney> = ({ showStartPage }) => {
  const [showState, setShowState] = useState(false);
  const [data, setData] = useState("");
  const [getType, setGetType] = useState("Всё");
  const [showActionSheet, setShowActionSheet] = useState("");
  const [moneyValue, setMoney] = useState("");
  const [dateValue, setDate] = useState("");
  const [keysData, setKeysData] = useState<Array<string>>([]);
  const [parsedData, setParsedData] = useState<Array<DataArray>>([]);
  const [toastData, setToastData] = useState<ToastData>();

  /**
   * Обновление данных
   * @param event Возвращаемый event от IonicRefresher
   */
  function doRefresh(event?: CustomEvent<RefresherEventDetail>) {
    keys(setKeysData).finally(() =>
      getItemsByType(keysData, getType, setParsedData).finally(() =>
        event?.detail.complete()
      )
    );
  }

  /**
   * Добавление данных с помощью QR кода
   */
  async function qrCodeAdd() {
    try {
      var qrData = await (await BarcodeScanner.scan()).text;
      console.log(qrData);
    } catch (e) {
      if (isPlatform("desktop")) {
        // тестовые данные для неправильных значений
        var qrData =
          "t=20180518T220500&s=975.88&fn=8710000101125654&i=99456&fp=1250448795&n=1";
        throw "Не поддерживается Desktop(web)";
      } else {
        throw e;
      }
    }
    var data = new URLSearchParams(qrData);
    if (!(data.has("t") && data.has("s"))) {
      throw "Неверный QR код";
    }
    var timeVal =
      data.has("t")
        ? (() => {
            let t = data.get("t");
            return (
              t?.slice(0, 4) +
              "-" +
              t?.slice(4, 6) +
              "-" +
              t?.slice(6, 11) +
              ":" +
              t?.slice(11, 13)
            );
          })()
        : ""; // Страшна
    console.log(timeVal);
    var time = new Date(Date.parse(timeVal) || Date.now()).toDateString();
    console.log(time);
    var sum = data.get("s")?.toString() || "";
    setDate(time);
    setMoney(sum);
    setData("Расход");
    setShowState(true);
  }

  useEffect(() => {
    doRefresh();
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
            onClick={() => doRefresh()}
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
          money={moneyValue.length > 1 ? moneyValue : undefined}
          date={dateValue.length > 1 ? dateValue : undefined}
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
                      doRefresh();
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
              qrCodeAdd().catch((e) => {
                setToastData({
                  show: true,
                  text: e,
                  duration: 1000,
                });
              });
            }}
          >
            <IonIcon icon={qrCode} />
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
      <IonToast
        isOpen={toastData?.show ? toastData.show : false}
        message={toastData?.text ? toastData.text : ""}
        duration={toastData?.duration ? toastData.duration : 0}
        onDidDismiss={() => {
          setToastData({ show: false } as ToastData);
        }}
      />
    </IonPage>
  );
};

export default MyMoney;
