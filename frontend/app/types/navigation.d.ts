import { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
  index: undefined; // No params for the main screen
  ProductDetail: { productId: string }; // Expect productId as a parameter
};

// Export type for props
export type ProductDetailScreenProps = StackScreenProps<
  RootStackParamList,
  "ProductDetail"
>;