import {
  IonModal,
  IonButton,
  IonContent,
  IonList,
  IonSelect,
  IonItem,
  IonSelectOption,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonDatetime,
  IonInput,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { Plugins } from "@capacitor/core";
import { useState } from "react";
const { Storage } = Plugins;

interface HomeProps {
  showState: any;
  setShowState: any;
  typeOfData: string;
}
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();

const nowDate = yyyy.toString() + "-" + mm.toString() + "-" + dd.toString();
export const AddDataModal: React.FC<HomeProps> = ({
  showState,
  setShowState,
  typeOfData,
}) => {
  const [dateValue, setDate] = useState("");
  const [typeValue, setType] = useState("");
  const [moneyValue, setMoney] = useState("");
  async function getItem(month: string) {
    const { value } = await Storage.get({ key: month });
    return value;
  }

  async function setItem(date: string, type: string, value: string) {
    if (type.length < 3) {
      type = typeOfData;
    }
    if (date.length < 3) {
      date = nowDate;
    }
    var dateValue = new Date(date);
    var dd = String(dateValue.getDate()).padStart(2, "0");
    var mm = String(dateValue.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = dateValue.getFullYear();
    var dateStamp = dd + "." + mm + "." + yyyy;
    var oldData = await getItem(dateStamp);
    if (String(oldData).length > 5) {
      var newOldData = JSON.parse(String(oldData)).data;
      await Storage.set({
        key: dateStamp,
        value: JSON.stringify({
          data: [
            ...newOldData,
            {
              date: dateStamp,
              type: type,
              value: value,
            },
          ],
        }),
      });
    } else {
      await Storage.set({
        key: dateStamp,
        value: JSON.stringify({
          data: [{ date: dateStamp, type: type, value: value }],
        }),
      });
    }
  }
  return (
    <IonModal isOpen={showState} onDidDismiss={() => setShowState(false)}>
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Добавить новые данные</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowState(false)}>
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonLabel>Тип данных</IonLabel>
            <IonSelect
              value={typeValue.length < 3 ? typeOfData : typeValue}
              onIonChange={(e) => {
                setType(String(e.detail.value));
              }}
            >
              <IonSelectOption value="Доход">Доход</IonSelectOption>
              <IonSelectOption value="Расход">Расход</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel>Дата</IonLabel>
            <IonDatetime
              displayFormat="DD.MM.YYYY"
              min="1994-03-14"
              max="2999-12-09"
              value={dateValue.length < 3 ? nowDate : dateValue}
              onIonChange={(e) => setDate(String(e.detail.value))}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              Введи количество денег (руб)
            </IonLabel>
            <IonInput
              type="number"
              onIonChange={(e) => setMoney(String(e.detail.value))}
            ></IonInput>
          </IonItem>
        </IonList>
      </IonContent>
      <IonButton
        type="submit"
        color="success"
        onClick={() => {
          setItem(dateValue, typeValue, moneyValue).finally(() =>
            setShowState(false)
          );
        }}
        disabled={moneyValue ? false : true}
      >
        Добавить
      </IonButton>
    </IonModal>
  );
};
