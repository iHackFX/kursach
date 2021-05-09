import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding,
} from "@capacitor/core";
import React from "react";
import DataArray from "./interfaces";
import { isPlatform } from "@ionic/react";
import { FileChooser } from "@ionic-native/file-chooser";

const { Filesystem, Storage } = Plugins;

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
const nowDate = yyyy.toString() + "-" + mm.toString() + "-" + dd.toString();

/**
 * Функция для генерации UUID
 * @returns Сгенерированный UUID
 */
function uuid() : string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


/**
 * Запись в базу данных
 * @param date Дата записи
 * @param type Тип записи ("Расход", "Доход")
 * @param value Количество денег
 * @param description Описание записи
 * @param typeT Вид "Расхода" записи
 */
async function setItem(
  date: string,
  type: string,
  value: string,
  description: string = "",
  typeT?: string,
) {
  if (date.length < 3) {
    date = nowDate;
  }
  var dateValue = new Date(date);
  var dd = String(dateValue.getDate()).padStart(2, "0");
  var mm = String(dateValue.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = dateValue.getFullYear();
  var dateStamp = dd + "." + mm + "." + yyyy;
  var oldData = await getItem("data");
  if (oldData.length > 0) {
    await Storage.set({
      key: "data",
      value: JSON.stringify({
        data: [
          ...oldData,
          {
            uuid: uuid(),
            date: dateStamp,
            type: type,
            typeT: typeT,
            value: value,
            description: description,
          },
        ],
      }),
    });
  } else {
    await Storage.set({
      key: "data",
      value: JSON.stringify({
        data: [
          {
            uuid: uuid(),
            date: dateStamp,
            type: type,
            typeT: typeT,
            value: value,
            description: description,
          },
        ],
      }),
    });
  }
}

/**
 * Обновление записи в базе данных
 * @param key Ключ для обновления
 * @param DataArray Массив данных
 */
async function updateItem(key: string, DataArray: Array<DataArray> | boolean) {
  await Storage.set({
    key: key,
    value: JSON.stringify({
      data: DataArray,
    }),
  });
}

/**
 * Получение возможных ключей
 * @param setKeysData UseState Set-функция куда записывать данные
 */
async function keys(
  setKeysData: React.Dispatch<React.SetStateAction<string[]>>
) {
  const { keys } = await Storage.keys();
  keys.sort();
  keys.reverse();
  setKeysData(keys);
}

/**
 * Получение данных из базы данных
 * @param key Ключ, по которому нужно получить данные
 * @returns Пустой массив если данные отсутствуют или массив данных
 */
async function getItem(key: string)  {
  const { value } = await Storage.get({ key: key });
  if (typeof value === "string") {
    return JSON.parse(String(value)).data;
  }
  return [];
}

/**
 * Удаление записи
 * @param uuid UUID записи, по которому нужно удалить запись
 */
async function deleteData(uuid: string) {
  var data: Array<DataArray> = await getItem("data");
  for (var i = 0; i < data.length; i++) {
    if (data[i].uuid === uuid) {
      data.splice(i, 1);
      break;
    }
  }
  updateItem("data", data);
}

/**
 * Полное очищение базы данных
 */
async function clearStorage() {
  await Storage.clear();
  console.log("Storage Cleared");
}

/**
 * Экспорт данных в файл, имеющий вид "exportedData-" + текущая дата в формате
 */
async function exportData() {
  var data: Array<DataArray> = await getItem("data");
  if (isPlatform("capacitor")) {
    try {
      const result = await Filesystem.writeFile({
        path: "exportedData-" + new Date().toDateString() + ".json",
        data: JSON.stringify({ data: [...data] }),
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8,
      });
    } catch (e) {
      console.error("Error: ", e);
    }
  } else if (isPlatform("desktop")) {
    var file = document.createElement("a");
    file.setAttribute(
      "href",
      "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify({ data: [...data] }))
    );
    file.setAttribute("download", "exportedData-" + String(new Date()));
    file.click();
  }
}

/**
 * Импортирование данных в приложение
 */
async function importData(JSONStringData?: String) {
  if (isPlatform("android")) {
    try {
      let dataPath = await FileChooser.open();
      let result = await Filesystem.readFile({
        path: dataPath,
        encoding: FilesystemEncoding.UTF8,
      });
      updateItem("data", JSON.parse(result.data).data);
    } catch (e) {
      console.error(e);
    }
  } else if (isPlatform("desktop")) {
    // TODO: Сделать импорт и для Desktop(Web) версии
    console.error("Пока не работает");
  }
}

  /**
   * Получение данных по типу данных
   * @param keys Массив ключей по которым нужно получить данные
   * @param setParsedData UseState Set-функция куда записывать данные
   */
   async function getItemsByType(keys: Array<string>, getType: string, setParsedData: React.Dispatch<React.SetStateAction<DataArray[]>>) {
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

export {
  keys,
  deleteData,
  setItem,
  getItem,
  getItemsByType,
  updateItem,
  clearStorage,
  exportData,
  importData,
};
