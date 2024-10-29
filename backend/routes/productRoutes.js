const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const productsMap = new Map();

const categoryDescriptions = {
  "Medical Equipment": [
    "High-quality medical equipment designed to meet the needs of modern clinics.",
    "These products ensure accuracy and reliability in patient diagnostics.",
    "Investing in the right equipment is crucial for delivering optimal patient care."
  ],
  
  "Diagnostic Tools": [
    "Essential tools for accurate and efficient diagnostics.",
    "Our diagnostic tools are equipped with the latest technology.",
    "They aid healthcare professionals in making informed decisions quickly."
  ],

  "Patient Care Supplies": [
    "Comprehensive supplies designed to enhance patient care.",
    "These supplies include everything from basic necessities to specialized items.",
    "Each product is selected for its quality and effectiveness in clinical settings."
  ],
  
  "Pharmaceuticals": [
    "Reliable pharmaceuticals for various health needs.",
    "We provide a wide range of medications to support patient treatment plans.",
    "All products are sourced from trusted manufacturers, ensuring safety and efficacy."
  ],

  "Health Monitoring Devices": [
    "Advanced devices for continuous health monitoring.",
    "These tools help in tracking vital signs and health metrics.",
    "Regular monitoring can lead to early detection and timely interventions."
  ],
  
  "Serums": [
    "Nourishing serums designed for various skin types.",
    "Formulated with potent ingredients to enhance skin health.",
    "These serums target specific concerns such as hydration, aging, and blemishes."
  ],

  "Creams": [
    "Moisturizing creams that provide deep hydration.",
    "Ideal for daily use, these creams help maintain skin barrier function.",
    "Available in various formulations to suit different skin types and concerns."
  ],

  "Face Wash": [
    "Gentle face washes suitable for daily use.",
    "Our formulations cleanse the skin without stripping it of its natural oils.",
    "They prepare the skin for further treatment, leaving it refreshed and clean."
  ],

  "Shampoo": [
    "Sulfate-free shampoos for healthy hair.",
    "Our shampoos cleanse without causing damage to the hair or scalp.",
    "They are enriched with natural ingredients that promote hair vitality and shine."
  ]
};

// Store category wise images
// We don't have the product images. So, saving category-wise images and surfacing that as a product image. 
const categoriesImages = {
  "Medical Equipment": ["MedicalEquipment.jpeg"],
  "Diagnostic Tools": ["DiagnosticTools.jpeg"],
  "Patient Care Supplies": ["PatientCareSupplies.jpeg"],
  "Pharmaceuticals": ["Pharmaceuticals.jpeg"],
  "Health Monitoring Devices": ["HealthMonitoringDevices.jpeg"],
  "Serums": ["Serum.jpeg"],
  "Creams": ["Creams.jpeg"],
  "Face Wash": ["FaceWash.jpeg"],
  "Shampoo": ["Shampoo.jpeg"],
};

// Clinic-related product categories
const categories = Object.keys(categoryDescriptions);

// Function to get a random item from an array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRating = (maxRating) => {
  return Math.random() * maxRating + 1;
};

// Diwali Offer details 
function isDiwaliOfferValid() {
  const currentDate = Date.now(); 
  
  // Diwali offer details.
  const startDate = new Date('2024-10-29');
  const endDate = new Date('2024-11-01');
  
  // Check if the input date is within the range
  return currentDate >= startDate && currentDate <= endDate;
}

// Load products from CSV at startup
function loadProducts() {
  const filePath = path.join(__dirname, '../file_database/Products.csv');
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const category = getRandomItem(categories); // Assign random clinic-related category
      // add description and category to the product data
      const product = {
        id: parseInt(row['Product ID']),
        name: row['Product Name'],
        price: parseFloat(row['Price']),
        description: categoryDescriptions[category],
        category: category,
        images: categoriesImages[category],
        rating: getRating(5),
        offers: [{type: "Diwali", isValid: isDiwaliOfferValid()}]
      };
      
      productsMap.set(product.id, product);
    })
    .on('end', () => {
      console.log('Products loaded from CSV file');
    });
}

loadProducts();

// READ all products
router.get('/', (req, res) => {
  res.json(Array.from(productsMap.values()));
});

// READ a single product by ID
router.get('/:id', (req, res) => {
  const product = productsMap.get(parseInt(req.params.id));
  if (product) res.json(product);
  else res.status(404).send('Product not found');
});

module.exports = router;
