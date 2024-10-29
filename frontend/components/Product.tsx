// ProductDetail.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { fetchProduct, Product } from "../integration/products"; // Adjust the path based on your file structure
import PagerViewExample from "./PagerViewExample";
import { SafeAreaView } from "react-native-safe-area-context";

const PlaceholderImage = require("@/assets/images/clinic.webp");

interface ProductDetailProps {
  productId: string; // Pass the product ID as a prop
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(productId);
        setProduct(data);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!product) {
    return <Text>No product found.</Text>;
  }

  const images = [
    { uri: require("@/assets/images/ClinikallyBrand.webp") },
    // Add more image objects as needed
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <PagerViewExample />
      </SafeAreaView>
      <Text style={styles.productName}>{product.name}</Text>
      <Text>Price: ${product.price.toFixed(2)}</Text>
      <Text>Category: {product.category}</Text>
      <Text>Description:</Text>
      {product.description.map((desc, index) => (
        <Text key={index}>- {desc}</Text>
      ))}
      <Button
        title="Add to Cart"
        onPress={() => console.log("Added to cart")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  error: {
    color: "red",
  },
  imageContainer: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
    flex: 1,
  },
});

export default ProductDetail;
