import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import ProductDetail from "@/components/ProductDetail";

export default function productDetail() {
  const { productId } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <ProductDetail productId={productId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
});
