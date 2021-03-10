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

            let controlAdd = true;
            barcodesSt.map((item) => {
              if (barcode.data === item.data) {
                item.confimed = true;
                controlAdd = false;
              }
            });

            if (controlAdd) {
              setBarcodesSt([...barcodesSt, barcode]);
            }

            setBarcodesConfirmed(
              barcodesSt.filter((item) => {
                return item.confimed === true;
              })
            );
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
        <Text style={styles.toutch}>Toque em um item para Selecionar</Text>
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
            <View style={styles.selectedView}>
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
    justifyContent: "space-around",
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#ade45d",
    marginVertical: 7,
    borderRadius: 7,
    // marginHorizontal: "5"
  },
  itemType: {
    fontWeight: "bold",
    marginLeft: 20,
  },
  itemData: {
    marginLeft: 15,
    marginRight: 20,
    fontSize: 17,
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
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
});

export default App;
