# Clinikally Product Catalogue Application

This React Native application showcases a product listing page with pagination for **Clinikally's** extensive catalog of 5000 products. Users can browse through various categories and view individual product details, including:

- Carousel of product images (using generated images through LLMs)
- Product description
- Price
- Promotional offers (e.g., Diwali offer)
- Product availability
- Earliest delivery date based on pincode

# Demo

![demo video](demo/Clinikally%20Demo%20Video.gif)

## Challenges Addressed

This application successfully addresses all challenges outlined in the assignment:

- **Product Selection:** Displays a list of products with simulated stock availability (80% in stock).
- **Pincode Input:** Allows pincode input and validates it, associating the user with the appropriate logistics provider.
- **Delivery Date Estimation Logic:** Estimates delivery date based on pincode and provider:
  - **Provider A:** Same-day delivery if ordered before 5 PM (in stock).
  - **Provider B:** Same-day delivery if ordered before 9 AM, next-day otherwise.
  - **General Partners:** Delivery within 2-5 days depending on the region.
- **Timer for Same-Day Delivery:** Implements a visible countdown timer (similar to Amazon) for Provider A and B orders, indicating time remaining for same-day delivery.
- **Date and Time Awareness:** The application factors in date and time for accurate delivery estimations.

## Installation

This is a full-stack application with a Node.js backend and a React Native frontend built using Expo.

### Frontend (React Native)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npx expo start
   ```

### Backend (Node.js)

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run in development mode:**
   ```bash
   npm run dev
   ```

## Testing

The application is tested across Android, iOS, and Web platforms, ensuring smooth product selection and product detail viewing.

## Author

**Naman Pahwa**

- **Email:** [namanpahwa20@gmail.com](mailto:namanpahwa20@gmail.com)

## Additional Notes

- The application utilizes nine categories (Serum, Creams, Patient Care, etc.).
- Images are generated using ChatGPT (brand and category-wise).
- Category-wise product descriptions are used due to limited product information.

> **Disclaimer:** Please note that the generated product images and descriptions may not be fully representative of actual products.
