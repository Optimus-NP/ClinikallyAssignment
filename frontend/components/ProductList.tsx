import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
} from "react-native";
import { fetchProducts, Product } from "../integration/products";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/app/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 150;
const PAGE_LIMIT = 10;

type ProductListNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ProductDetail"
>;

const imagesByCategory: { [key: string]: any } = {
  "Medical Equipment": require("@/assets/images/MedicalEquipment.jpeg"),
  "Diagnostic Tools": require("@/assets/images/DiagnosticTools.jpeg"),
  "Patient Care Supplies": require("@/assets/images/PatientCareSupplies.jpeg"),
  Pharmaceuticals: require("@/assets/images/Pharmaceuticals.jpeg"),
  "Health Monitoring Devices": require("@/assets/images/HealthMonitoringDevices.jpeg"),
  Serums: require("@/assets/images/Serum.jpeg"),
  Creams: require("@/assets/images/Creams.jpeg"),
  "Face Wash": require("@/assets/images/FaceWash.jpeg"),
  Shampoo: require("@/assets/images/Shampoo.jpeg"),
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const navigation = useNavigation<ProductListNavigationProp>();

  useEffect(() => {
    loadProducts(page);
  }, [page]);

  const loadProducts = async (pageNumber: number) => {
    if (!hasMore) return;

    setLoading(true);
    setIsFetching(true);
    try {
      const data = await fetchProducts({ pageLimit: PAGE_LIMIT, pageNumber });
      if (data.length < PAGE_LIMIT) {
        setHasMore(false);
      }

      const uniqueProducts = Array.from(
        new Set([...products.map((p) => p.id), ...data.map((d) => d.id)])
      )
        .map((id) => {
          return [...products, ...data].find((item) => item.id === id);
        })
        .filter(Boolean) as Product[];

      setProducts(uniqueProducts);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <Image
        source={imagesByCategory[item.category]}
        style={styles.productImage}
      />
      <View style={styles.productDetails}>
        <Text style={styles.productCategory}>{"Home > " + item.category}</Text>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>₹{item.price.toFixed(2)}</Text>
        <Text style={styles.productRating}>
          Rating: {item.rating.toFixed(1) + "/5"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleProductPress = (product: Product) => {
    navigation.navigate("ProductDetail", { productId: product.id.toString() });
  };

  const loadMoreProducts = () => {
    if (!loading && !isFetching && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderFooter = () => {
    if (loading && isFetching) {
      return (
        <ActivityIndicator
          size="large"
          color="#6200EE"
          style={styles.loadingIndicator}
        />
      );
    }
    return null;
  };

  if (loading && page === 1) {
    return <Text>Loading products...</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => `product-${item.id}`}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 20,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    width: width * 0.9, // Card width to be slightly less than the screen width
    alignSelf: "center",
    height: CARD_HEIGHT,
    elevation: 4,
  },
  productImage: {
    width: CARD_HEIGHT - 20,
    height: CARD_HEIGHT - 20,
    borderRadius: 10,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    paddingTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#FFD700",
    marginBottom: 3,
  },
  productCategory: {
    fontSize: 14,
    color: "#FFFFFF",
    marginBottom: 3,
  },
  productRating: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: 20,
  },
  loadingIndicator: {
    padding: 20,
  },
});

export default ProductList;
