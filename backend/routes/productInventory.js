const express = require('express');
const router = express.Router();
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const productsInventoryMap = new Map();
const productsInventoryArray = new Array();
const pinCodeMap = new Map();

// Generate a random no. and take a mod by 10 to simulate if few items left
const areOnlyFewItemsLeft = (maxProducts) => {
  return Math.floor(Math.random() * maxProducts + 1) % 10 <= 5;
};

// Load Inventory from CSV at startup
function loadInventory() {
  const filePath = path.join(__dirname, '../file_database/Stock.csv');
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const isStockAvailable = row['Stock Available'].toLowerCase() === 'true';
      const productInventory = {
        id: parseInt(row['Product ID']),
        stockAvailable:  isStockAvailable,
        areOnlyFewItemsLeft: isStockAvailable && areOnlyFewItemsLeft(5000),
      };
      productsInventoryArray.push(productInventory);
      productsInventoryMap.set(productInventory.id, productInventory);
    })
    .on('end', () => {
      console.log('Stocks loaded from CSV file');
    });
}

loadInventory();

// Load Pincodes from CSV at startup
// Currently as per the data, we have only one logistics partner serving one pincode.
// we are assuming the same, although, this wouldn't be the case in production.
function loadPinCode() {
  const filePath = path.join(__dirname, '../file_database/Pincodes.csv');
  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const pinCode = {
        pincode: parseInt(row['Pincode']),
        logisticsProvider: row['Logistics Provider'],
        turnAroundTime: row['TAT'],
      };
      if (pinCodeMap.get(pinCode.pincode)) {
        console.warn(`${pinCode.pincode} exists already`);
      } else {
        pinCodeMap.set(pinCode.pincode, pinCode);
      }
    })
    .on('end', () => {
      console.log('Pincodes loaded from CSV file');
    });
}

loadPinCode();

router.get('/paginated', (req, res) => {
  // Parse query parameters
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default limit to 10

  // Calculate start and end index for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Get paginated products
  const paginatedProductsInventory = productsInventoryArray.slice(startIndex, endIndex);
  
  // Create response object
  const response = {
    currentPage: page,
    totalPages: Math.ceil(productsInventoryArray.length / limit),
    totalProducts: productsInventoryArray.length,
    productsInventoryData: paginatedProductsInventory,
  };

  res.json(response);
});

const isBeforeHours = (hour) => {
  const now = new Date();
  return now.getHours() < hour;
};

const isSameDayDeliveryPossible = (logisticsProvider) => {
  if (logisticsProvider === 'Provider A') {
    return isBeforeHours(17);
  }
  if (logisticsProvider === 'Provider B') {
    return isBeforeHours(9);
  }
  return false;
};

function secondsUntilHour(hour) {
  const now = new Date();
  const hourTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0); 

  if (now >= hourTime) {
    return 0;
  }

  const differenceInMilliseconds = hourTime - now;
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

  return differenceInSeconds;
}

const expiryTimeInSecsForSameDayDelivery = (logisticsProvider) => {
  if (logisticsProvider === 'Provider A') {
    return secondsUntilHour(17);
  }
  if (logisticsProvider === 'Provider B') {
    return secondsUntilHour(9);
  }
  return 0;
}

// validate a pincode.
router.get('/pincode/:pincode', (req, res) => {
  let pinCode = pinCodeMap.get(parseInt(req.params.pincode));
  if (pinCode) {
    pinCode = {...pinCode, isSameDayDeliveryPossible: isSameDayDeliveryPossible(pinCode.logisticsProvider), expiryTimeForSameDayDelivery: expiryTimeInSecsForSameDayDelivery(pinCode.logisticsProvider)};
    res.json(pinCode);
  }
  else res.status(404).send('Pincode not found');
});

// get Inventory.
router.get('/single/:id', (req, res) => {
  const product = productsInventoryMap.get(parseInt(req.params.id));
  if (product) res.json(product);
  else res.status(404).send('Product not found');
});

module.exports = router;
