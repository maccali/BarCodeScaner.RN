import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { RNCamera } from "react-native-camera";
import { useCamera } from "react-native-camera-hooks";

function App({ initialProps }) {
  const [barcodesSt, setBarcodesSt] = useState([]);
  const [alertAtention, setAlertAtention] = useState(false);
  const [dataCodeBar, setDataCodeBar] = useState("");

  const [{ cameraRef }] = useCamera(initialProps);

  const createAlert = (itemCode) =>
    Alert.alert(
      "Código Lido!",
      itemCode,
      [{ text: "OK", onPress: () => reset() }],
      { cancelable: false }
    );

  const reset = () => {
    setAlertAtention(false);
    setDataCodeBar("");
    setBarcodesSt([]);
  };

  const barcodeRecognized = ({ barcodes }) => {
    if (!alertAtention) {
      barcodes.forEach((barcode) => {
        if (barcode.type) {
          if (barcode.type !== "UNKNOWN_FORMAT") {
            console.log("BARCODE -> data", barcode.data);

            setBarcodesSt([...barcodesSt, barcode]);
          }

          let barCodeObjectsLenght = barcodesSt.length;

          if (barCodeObjectsLenght >= 3) {
            const codeBarNumber = barcodesSt[0].data;

            const barCodesFiltered = barcodesSt.filter((barCodeOnject) => {
              return barCodeOnject.data === codeBarNumber;
            });

            if (barCodeObjectsLenght === barCodesFiltered.length) {
              console.log("CONFIRMED =>> ", barCodesFiltered);
              setAlertAtention(true);
              createAlert(codeBarNumber);
            }
          }
        }
      });
    }
  };

  return (
    <RNCamera
      captureAudio={false}
      ref={cameraRef}
      style={styles.scanner}
      onGoogleVisionBarcodesDetected={barcodeRecognized}
      googleVisionBarcodeMode={
        RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeMode.ALTERNATE
      }
    ></RNCamera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black",
  },
  scanner: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default App;
