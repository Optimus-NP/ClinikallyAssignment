import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import PagerView from "react-native-pager-view";
import { Image } from "expo-image";

interface PagerViewExampleProps {
  images: string[];
}

// Carousel component using PagerView
const PagerViewExample: React.FC<PagerViewExampleProps> = ({ images }) => {
  const { width } = Dimensions.get("window");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pagerRef = useRef<PagerView>(null);
  const numberOfPages = images.length;
  const intervalTime = 3000;

  const getNextPage = (prevPage: number): number => {
    return (prevPage + 1) % numberOfPages;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPage((prevPage) => {
        const nextPage = getNextPage(prevPage);
        if (pagerRef.current) {
          pagerRef.current.setPage(nextPage);
        }
        return nextPage;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [numberOfPages]);

  return (
    <PagerView
      ref={pagerRef}
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
    height: 180,
    borderRadius: 10,
  },
});

export default PagerViewExample;
