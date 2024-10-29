import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";

// Sample images array with URLs
const images: string[] = [
  require("@/assets/images/clinic.webp"),
  require("@/assets/images/Serum.jpeg"),
  require("@/assets/images/HealthMonitoringDevices.jpeg"),
  require("@/assets/images/Creams.jpeg"),
];

// Carousel component using PagerView
const PagerViewExample: React.FC = () => {
  const { width } = Dimensions.get("window");
  const [currentPage, setCurrentPage] = useState<number>(0);

  const pagerRef = useRef<PagerView>(null);
  const numberOfPages = images.length; // Adjust this to the number of pages you have
  const intervalTime = 3000; // Time in milliseconds for auto switch

  const getNextPage = (prevPage: number): number => {
    return (prevPage + 1) % numberOfPages;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pagerRef.current) {
        const nextPage = getNextPage(currentPage);
        pagerRef.current.setPage(nextPage);
        setCurrentPage(nextPage);
      }
      console.log("I came here...");
    }, intervalTime);

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, [currentPage, numberOfPages, intervalTime]);

  return (
    <PagerView
      style={styles.pagerView}
      initialPage={0}
      onPageSelected={(event) => setCurrentPage(event.nativeEvent.position)}
    >
      {images.map((image: string, index: number) => (
        <View key={index.toString()} style={styles.page}>
          <Image source={image} style={[styles.image, { width }]} />
        </View>
      ))}
    </PagerView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 300,
    borderRadius: 10,
  },
});

export default PagerViewExample;
