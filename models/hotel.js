const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  price: Number,
});


//array of objects as a hotel
const Hotel = mongoose.model('Hotel', hotelSchema);

const hotels = [
  {
    name: 'Oyo Rooms',
    location: 'Greater Noida',
    description: 'A luxurious hotel in the heart of Noida',
    price: 200,
  },
  {
    name: 'Beach Hotel',
    location: 'Mumbai',
    description: 'A cozy hotel with scenic views in Mumbai',
    price: 150,
  },
  {
    name: 'Taj Hotel',
    location: 'Delhi',
    description: 'A modern hotel in the bustling Delhi',
    price: 180,
  },
  
];

function seedMockHotels() {
  Hotel.insertMany(hotels)
    .then(() => {
      console.log('Mock hotels data seeded successfully.');
    })
    .catch((err) => {
      console.error('Error seeding mock hotels data:', err);
    });
}

module.exports = {
  Hotel,
  seedMockHotels,
};
