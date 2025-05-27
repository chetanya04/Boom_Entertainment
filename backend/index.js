const express = require('express');
const mongoose = require('mongoose');
const uploadRoute = require('./routes/upload');
const cors = require('cors');
const feedRoute = require('./routes/feed')
const app = express();
const purchaseRoutes = require('./routes/purchase')
const userRoutes = require('./routes/UserRoute')


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 
app.use('/api/upload', uploadRoute);
app.use('/api/feed',feedRoute)
app.use('/api/purchase', purchaseRoutes);
app.use('/api/user', userRoutes);
mongoose.connect('mongodb+srv://chetanya04:jf03kSbLwZseNcTA@cling-backend.pcncy.mongodb.net/?retryWrites=true&w=majority&appName=Cling-Backend')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(5000, () => {
      console.log('Server running on port 5000');
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });