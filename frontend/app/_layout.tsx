import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Products" }} />
      <Stack.Screen
        name="productDetails/[productId]"
        options={{ title: "Product Details" }}
      />
    </Stack>
  );
}
