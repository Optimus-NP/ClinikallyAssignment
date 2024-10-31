import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput, // Import Image for displaying the product images
} from "react-native";
import {
  fetchPincodeAvailability,
  fetchProduct,
  fetchProductInventory,
  PincodeNotFound,
  Product,
  ProductInventory,
} from "../integration/products"; // Adjust path as needed
import PagerViewExample from "./PagerViewExample";
import { SafeAreaView } from "react-native-safe-area-context";
import Stars from "react-native-stars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CountdownTimer from "./CountdownTimer";

const PlaceholderImage = require("@/assets/images/clinic.webp");

interface ProductDetailProps {
  productId: string;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  console.log("ProductDetail: " + JSON.stringify(productId));
  const [product, setProduct] = useState<Product | null>(null);
  const [productInventory, setProductInventory] =
    useState<ProductInventory | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDiwaliOffer, setIsDiwaliOffer] = useState<boolean>(false);
  const [hurryFewLeft, setHurryFewLeft] = useState<boolean>(false);
  const [pincode, setPincode] = useState("");
  const [availability, setAvailability] = useState<string | null>(null);
  const [buyNowText, setBuyNowText] = useState<string>("Buy Now");
  const [expiryTimeForSameDayDelivery, setExpiryTimeForSameDayDelivery] =
    useState<number>(0);

  function hasValidDiwaliOffer(product: Product): boolean {
    return product.offers.some(
      (offer) => offer.type.toLowerCase() === "diwali" && offer.isValid
    );
  }

  useEffect(() => {
    console.log("UseEffect: " + productId);
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

  useEffect(() => {
    const loadProductInventory = async () => {
      try {
        const data = await fetchProductInventory(productId);
        setProductInventory(data);
        if (!data.stockAvailable) {
          setBuyNowText("PreOrder");
        }
        setHurryFewLeft(data.areOnlyFewItemsLeft);
      } catch (err) {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    loadProductInventory();
  }, [productId]);

  useEffect(() => {
    const loadPincodeData = async () => {
      if (pincode && pincode.length === 6) {
        try {
          const data = await fetchPincodeAvailability(pincode);
          if (data.isSameDayDeliveryPossible) {
            setAvailability(`Deliverable Today`);
            setExpiryTimeForSameDayDelivery(data.expiryTimeForSameDayDelivery);
          } else {
            setAvailability(`Deliverable in ${data.turnAroundTime} days`);
          }
        } catch (error) {
          if (error instanceof PincodeNotFound) {
            setAvailability("Pincode Not found");
          } else {
            setAvailability("Unknown Availability in Pincode");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    loadPincodeData();
  }, [pincode]);

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
            {isDiwaliOffer && (
              <View style={styles.originalPrice}>
                <Text style={styles.originalPrice}>
                  ₹{product.price.toFixed(2)}
                </Text>
                <Text style={styles.discountedPrice}>
                  ₹{product.discountedPrice?.toFixed(2)}
                </Text>
              </View>
            )}
            {!isDiwaliOffer && (
              <View style={styles.originalPrice}>
                <Text style={styles.discountedPrice}>
                  ₹{product.price?.toFixed(2)}
                </Text>
              </View>
            )}
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
          <View style={styles.specificBadgesContainer}>
            {hurryFewLeft && (
              <View style={styles.hurryFewLeftContainer}>
                <Text style={styles.hurryFewLeftText}>Hurry Few Left!</Text>
              </View>
            )}
            {productInventory?.stockAvailable === false && (
              <View style={styles.hurryFewLeftContainer}>
                <Text style={styles.hurryFewLeftText}>Stock Unavailable!</Text>
              </View>
            )}
            {availability && expiryTimeForSameDayDelivery != 0 && (
              <View style={styles.hurryFewLeftContainer}>
                <CountdownTimer initialSeconds={expiryTimeForSameDayDelivery} />
              </View>
            )}
          </View>
          {productInventory?.stockAvailable && (
            <View style={styles.pincodeContainer}>
              <TextInput
                style={styles.pincodeInput}
                placeholder="Enter Pincode"
                keyboardType="numeric"
                value={pincode}
                onChangeText={setPincode}
                maxLength={6} // Limit to 6 digits
              />
              {availability && (
                <Text style={styles.availabilityMessage}>{availability}</Text>
              )}
            </View>
          )}
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
              <Text style={styles.buttonText}>{buyNowText}</Text>
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
    height: 180, // Fixed height for PagerView
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
  originalPrice: {
    fontSize: 16,
    color: "#888",
    textDecorationLine: "line-through", // Strikethrough style
    marginRight: 10,
  },
  discountedPrice: {
    fontSize: 18,
    color: "#6200EE",
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
  hurryFewLeftContainer: {
    backgroundColor: "#FF5722", // Bold color for urgency
    padding: 8,
    borderRadius: 5,
    marginBottom: 10, // Space between the message and buttons
  },
  hurryFewLeftText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  specificBadgesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  pincodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  pincodeInput: {
    flex: 1,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  availabilityMessage: {
    fontSize: 16,
    color: "#6200EE",
    marginVertical: 10,
  },
});

export default ProductDetail;
