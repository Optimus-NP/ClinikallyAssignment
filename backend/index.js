const express = require('express');
const productRoutes = require('./routes/productRoutes');
const productInventory = require('./routes/productInventory');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/inventory', productInventory);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});