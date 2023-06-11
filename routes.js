const express = require('express');
const router = express.Router();
const {Hotel} = require('./models/hotel');
const Booking = require('./models/booking');
const User = require('./models/user');



//for signup like new user is registering with their details
router.get('/signup', (req, res) => {
    res.render('signup');
  });
  
  
  router.post('/signup', (req, res) => {
    const { name, email, password, phone, address } = req.body;
  
  
    const newUser = new User({
      name,
      email,
      password,
      phone,
      address,
    });
  
    newUser.save()
      .then(() => {
        res.render('login');
      })
      .catch((err) => {
        console.error('Error saving user to the database', err);
        res.status(500).send('An error occurred');
      });
  });


//for login ,when user is registered we log in to the user
  router.get('/login', (req, res) => {
    res.render('login');
  });
  
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          res.render('login',{error:'No user found'});
        } else {
          if (password === user.password && email=== user.email) {
            res.render('user-details', { user });
        } else {
            res.render('login', { error: 'Invalid email or password' });
  
          }
        }
      })
      .catch((err) => {
        console.error('Error finding user in the database', err);
        res.status(500).send('An error occurred');
      });
  });


//this is for the endpoint to get user by their id from database
  router.get('/users/:id/edit', (req, res) => {
    const userId = req.params.id;
  
    User.findById(userId)
      .then((user) => {
        res.render('user-update', { user });
      })
      .catch((err) => {
        console.error('Error finding user in the database', err);
        res.status(500).send('An error occurred');
      });
  });
  


//this if for getting hotel details which i saved predefined hotels 
//in db by calling a function once in server.js
  router.get('/users/:id/hotel', (req, res) => {
    const userId = req.params.id;
  
    User.findById(userId)
      .then((user) => {
        Hotel.find()
          .then((hotels) => {
            res.render('hotel-details', { user, hotels });
          })
          .catch((err) => {
            console.error('Error finding hotels in the database', err);
            res.status(500).send('An error occurred');
          });
      })
      .catch((err) => {
        console.error('Error finding user in the database', err);
        res.status(500).send('An error occurred');
      });
  });

  router.post('/users/:id/hotel', (req, res) => {
    const userId = req.params.id;
    const hotelId = req.body.hotelId;
  
    User.findById(userId)
      .then((user) => {
        Hotel.findById(hotelId)
          .then((hotel) => {
            if (!hotel) {
              return res.render('error', { message: 'Hotel not found' });
            }
  
            user.bookings.push({ hotel: hotel._id });
            user.save()
              .then(() => {
                res.redirect(`/users/${userId}/booking-history`);
              })
              .catch((err) => {
                console.error('Error saving user to the database', err);
                res.status(500).send('An error occurred');
              });
          })
          .catch((err) => {
            console.error('Error finding hotel in the database', err);
            res.status(500).send('An error occurred');
          });
      })
      .catch((err) => {
        console.error('Error finding user in the database', err);
        res.status(500).send('An error occurred');
      });
  });
  
  

//this helps us to book the hotel and if booked then show 
//the history and various functionality.
  router.post('/users/:userId/hotel/book', (req, res) => {
    const userId = req.params.userId;
    const { hotelId, date } = req.body;
  
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.render('error', { message: 'User not found' });
        }
  
        Hotel.findOne({ _id: hotelId })
          .then((hotel) => {
            if (!hotel) {
              return res.render('error', { message: 'Hotel not found' });
            }
  
            // this will check if the hotel is booked on the specific date
            Booking.findOne({ hotel: hotel._id, date: new Date(date) })
              .then((existingBooking) => {
                if (existingBooking) {
                  return res.render('error', { message: 'Hotel is already booked for the selected date' });
                }
  
                const newBooking = new Booking({
                  user: user._id,
                  hotel: hotel._id,
                  date: new Date(date),
                });
  
                newBooking.save()
                  .then(() => {
                    res.redirect(`/users/${userId}/booking-history`);
                  })
                  .catch((err) => {
                    console.error('Error saving booking to the database', err);
                    res.status(500).send('An error occurred');
                  });
              })
              .catch((err) => {
                console.error('Error finding existing booking in the database', err);
                res.status(500).send('An error occurred');
              });
          })
          .catch((err) => {
            console.error('Error finding hotel in the database', err);
            res.status(500).send('An error occurred');
          });
      })
      .catch((err) => {
        console.error('Error finding user in the database', err);
        res.status(500).send('An error occurred');
      });
  });
  
  
  //THIS gets the booking history of user
  router.get('/users/:id/booking-history', (req, res) => {
    const userId = req.params.id;
  
    Booking.find({ user: userId })
      .populate('user')
      .populate('hotel')
      .exec()
      .then((bookings) => {
        if (bookings.length === 0) {
          res.render('error', { message: 'No bookings found' });
        } else {
          res.render('booking-history', { bookings });
        }
      }) 
      .catch((err) => {
        console.error('Error finding bookings in the database', err);
        res.status(500).send('An error occurred');
      });
  });
  
  module.exports = router;
  
