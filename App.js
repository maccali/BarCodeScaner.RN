import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { RNCamera } from "react-native-camera";
import { useCamera } from "react-native-camera-hooks";

function App({ initialProps }) {
  const [barcodesSt, setBarcodesSt] = useState([]);
  const [barcodesConfirmed, setBarcodesConfirmed] = useState([]);

  const [itemSelected, setItemSelected] = useState(false);
  const [alertAtention, setAlertAtention] = useState(false);
  const [dataCodeBar, setDataCodeBar] = useState("");
  const [typeCodeBar, setTypeDataCodeBar] = useState("");

  const [{ cameraRef }] = useCamera(initialProps);

  const datat = [{ data: "1" }, { data: "2" }, { data: "3" }, { data: "4" }];

  const createAlert = (itemCode, typeCode) =>
    Alert.alert(
      "Código Lido!",
      `O código ${itemCode} do tipo ${typeCode} foi lido`,
      [{ text: "OK", onPress: () => reset() }],
      { cancelable: false }
    );

  const reset = () => {
    setAlertAtention(false);
    setDataCodeBar("");
    setTypeDataCodeBar("");
    setBarcodesSt([]);
  };

  const barcodeRecognized = ({ barcodes }) => {
    if (!alertAtention) {
      barcodes.forEach((barcode) => {
        if (barcode.type) {
          if (barcode.type !== "UNKNOWN_FORMAT") {
            console.log("BARCODE -> data", barcode.data);

            setBarcodesSt([...barcodesSt, barcode]);

            var contain = false;
            barcodesSt.map((item) => {
              if (item.data === barcode.data) {
                for (var i = 0; i < barcodesConfirmed.length; i++) {
                  if (barcodesConfirmed[i].data == barcode.data) {
                    contain = true;
                    break;
                  }
                }
                if (!contain) {
                  setBarcodesConfirmed([...barcodesConfirmed, barcode]);
                }
              }
            });
          }
        }
      });
    }
  };

  const selectItem = (item) => setItemSelected(item);

  const Item = ({ item, onPress, style }) => (
    <TouchableOpacity onPress={() => selectItem(item)} style={styles.item}>
      <Text style={styles.itemType}>{item.type}</Text>
      <Text style={styles.itemData}>{item.data}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    return <Item item={item} onPress={() => setSelectedId(item.id)} />;
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
    >
      <View>
        {barcodesConfirmed.length > 0 ? (
          <Text style={styles.toutch}>Toque em um item para Selecionar</Text>
        ) : (
          <Text style={styles.toutch}>Aponte para o código de barras</Text>
        )}
        <FlatList
          data={barcodesConfirmed}
          renderItem={renderItem}
          keyExtractor={(item) => item.data}
        />
        {itemSelected ? (
          <View style={styles.selectedView}>
            <Text style={styles.itemSelectedTitle}>
              O seguinte item está selecionado
            </Text>
            <View style={styles.selectedViewItem}>
              <Text style={styles.itemType}>{itemSelected.type}</Text>
              <Text style={styles.itemData}>{itemSelected.data}</Text>
            </View>
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
    </RNCamera>
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
  item: {
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ade45d",
    marginVertical: 7,
    borderRadius: 7,
    // marginHorizontal: "5"
  },
  itemType: {
    fontWeight: "bold",
    alignSelf: "center",
  },
  itemData: {
    fontSize: 17,
    alignSelf: "center",
  },
  toutch: {
    backgroundColor: "#ffffff",
    fontSize: 16,
    alignSelf: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    marginBottom: 10,
  },
  selectedView: {
    backgroundColor: "#ffffff",
    fontSize: 16,
    alignSelf: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  selectedViewItem: {
    fontSize: 16,
    alignSelf: "center",
    justifyContent: "center",
  },
  itemSelectedTitle: {
    fontSize: 17,
    marginBottom: 5,
    marginHorizontal: 15,
  },
});

export default App;
