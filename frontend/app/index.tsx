import { StyleSheet, View } from "react-native";
import ProductList from "@/components/ProductList";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ProductList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
