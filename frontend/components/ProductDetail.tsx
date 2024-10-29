import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Image, // Import Image for displaying the product images
} from "react-native";
import { fetchProduct, Product } from "../integration/products"; // Adjust path as needed
import PagerViewExample from "./PagerViewExample";
import { SafeAreaView } from "react-native-safe-area-context";
import Stars from "react-native-stars";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const PlaceholderImage = require("@/assets/images/clinic.webp");

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDiwaliOffer, setIsDiwaliOffer] = useState<boolean>(false);

  function hasValidDiwaliOffer(product: Product): boolean {
    return product.offers.some(
      (offer) => offer.type.toLowerCase() === "diwali" && offer.isValid
    );
  }

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProduct(productId);
        setProduct(data);
        setIsDiwaliOffer(hasValidDiwaliOffer(data));
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
    require("@/assets/images/ClinikallyBrand.webp"),
    require("@/assets/images/Serum.jpeg"),
    require("@/assets/images/HealthMonitoringDevices.jpeg"),
    require("@/assets/images/Creams.jpeg"),
  ];

  const handleAddToCart = () => {
    console.log("Added to cart");
  };

  const handleBuyNow = () => {
    console.log("Proceeding to buy");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.category}>{"Home / " + product.category}</Text>
        <View style={styles.imageCarousel}>
          <PagerViewExample images={images} />
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <View style={styles.priceRatingContainer}>
            <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
            <View style={styles.ratingContainer}>
              <Stars
                default={product.rating || 4} // Default rating; adjust as needed
                count={5}
                half={true}
                starSize={30}
                fullStar={
                  <MaterialCommunityIcons
                    name="star"
                    style={styles.starStyle}
                  />
                }
                emptyStar={
                  <MaterialCommunityIcons
                    name="star-outline"
                    style={styles.starStyle}
                  />
                }
                halfStar={
                  <MaterialCommunityIcons
                    name="star-half"
                    style={styles.starStyle}
                  />
                }
              />
              <Text style={styles.ratingText}>
                {product.rating.toFixed(1) || 4.0} / 5.0
              </Text>
            </View>
          </View>
          <Text style={styles.descriptionHeader}>Description:</Text>
          {product.description.map((desc, index) => (
            <Text key={index} style={styles.descriptionText}>
              - {desc}
            </Text>
          ))}
          {/* Button Container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
              <MaterialCommunityIcons name="cart" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleBuyNow}>
              <MaterialCommunityIcons
                name="credit-card"
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>Buy Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {isDiwaliOffer && (
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>Diwali Offer!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

// Updated styles
const styles = StyleSheet.create({
  scrollViewContent: {
    paddingBottom: 20,
    backgroundColor: "#FFFFFF", // Set background to white
  },
  imageCarousel: {
    height: 300, // Fixed height for PagerView
    position: "relative", // Allow absolute positioning of badge
  },
  productInfo: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#FFFFFF", // Ensure product info section is also on a white background
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333", // Darker text for readability
    marginBottom: 10,
  },
  priceRatingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Align items vertically centered
    marginBottom: 10, // Space below the price and rating
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  starStyle: {
    color: "#FFD700", // Gold color for stars
    fontSize: 24,
    marginHorizontal: 2,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333333",
  },
  price: {
    fontSize: 18,
    color: "#6200EE", // Bright purple color for price
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: "#0000FF", // Bright blue color for category
    marginBottom: 10,
  },
  descriptionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF5722", // Bright orange color for the "Description" header
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: "#333333", // Standard dark text for description
    marginBottom: 5,
  },
  error: {
    color: "red",
    textAlign: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Space between buttons
    marginTop: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200EE", // Button color
    padding: 10,
    borderRadius: 5,
    flex: 1, // Allows the buttons to take equal space
    marginHorizontal: 5, // Space between buttons
  },
  buttonIcon: {
    color: "#FFFFFF", // Icon color
    fontSize: 20,
    marginRight: 5, // Space between icon and text
  },
  buttonText: {
    color: "#FFFFFF", // Button text color
    fontSize: 16,
    textAlign: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: 90,
    left: 5,
    backgroundColor: "rgba(255, 165, 0, 0.8)", // Semi-transparent orange
    borderRadius: 10,
    padding: 5,
    zIndex: 1, // Ensure the badge is on top
  },
  badgeText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProductDetail;
