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
  IonTextarea,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { useEffect, useState } from "react";
import { setItem } from "../components/storage";

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
  const [typeT, setTypeT] = useState("");
  const [moneyValue, setMoney] = useState("");
  const [description, setDescription] = useState("");
  useEffect(() => {
    setType(typeOfData);
    setTypeT("Прочее");
  }, [showState]);

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
              value={typeValue}
              onIonChange={(e) => {
                setType(String(e.detail.value));
              }}
            >
              <IonSelectOption value="Доход">Доход</IonSelectOption>
              <IonSelectOption value="Расход">Расход</IonSelectOption>
            </IonSelect>
          </IonItem>
          {typeValue == "Расход" ? (
            <IonItem>
              <IonLabel>Тип Расходов</IonLabel>
              <IonSelect
                onIonChange={(e) => {
                  setTypeT(String(e.detail.value));
                }}
                value={typeT}
              >
                <IonSelectOption value="Супермаркеты">
                  Супермаркеты
                </IonSelectOption>
                <IonSelectOption value="Всё для дома">
                  Всё для дома
                </IonSelectOption>
                <IonSelectOption value="Услуги связи">
                  Услуги связи
                </IonSelectOption>
                <IonSelectOption value="Одежда и аксессуары">
                  Одежда и аксессуары
                </IonSelectOption>
                <IonSelectOption value="Рестораны и кафе">
                  Рестораны и кафе
                </IonSelectOption>
                <IonSelectOption value="Транспорт">Транспорт</IonSelectOption>
                <IonSelectOption value="Прочее">Прочее</IonSelectOption>
              </IonSelect>
            </IonItem>
          ) : (
            ""
          )}
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
          <IonItem>
            <IonLabel position="floating">Описание</IonLabel>
            <IonTextarea
              value={description}
              onIonChange={(e) => setDescription(e.detail.value!)}
            ></IonTextarea>
          </IonItem>
        </IonList>
      </IonContent>
      <IonButton
        type="submit"
        color="success"
        onClick={() => {
          if (typeValue === "Доход"){
            setItem(
              dateValue,
              typeValue,
              typeOfData,
              "",
              moneyValue,
              description
            ).finally(() => setShowState(false));
          }else{
            setItem(
              dateValue,
              typeValue,
              typeOfData,
              typeT,
              moneyValue,
              description
            ).finally(() => setShowState(false));
          }
        }}
        disabled={moneyValue ? false : true}
      >
        Добавить
      </IonButton>
    </IonModal>
  );
};
