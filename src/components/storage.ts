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

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function setItem(
  date: string,
  type: string,
  typeOfData: string = "",
  typeT: string | null = null,
  value: string,
  description: string | null = null
) {
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

async function updateItem(key: string, DataArray: Array<DataArray> | boolean) {
  await Storage.set({
    key: key,
    value: JSON.stringify({
      data: DataArray,
    }),
  });
}

async function keys(
  setKeysData: React.Dispatch<React.SetStateAction<string[]>>
) {
  const { keys } = await Storage.keys();
  keys.sort();
  keys.reverse();
  setKeysData(keys);
}

async function getItem(key: string) {
  const { value } = await Storage.get({ key: key });
  if (typeof value === "string") {
    return JSON.parse(String(value)).data;
  }
  return [];
}

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

async function clearStorage() {
  await Storage.clear();
  console.log("Storage Cleared");
}

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

async function importData() {
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
    // TODO:Сделать импорт и для ПК версии
    console.error("Пока не работает");
  }
}

export {
  keys,
  deleteData,
  setItem,
  getItem,
  updateItem,
  clearStorage,
  exportData,
  importData,
};
