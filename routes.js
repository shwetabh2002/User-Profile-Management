const express = require('express');
const router = express.Router();
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
  

//this is used to update the user details in the database
  router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, phone, address } = req.body;
  
    User.findByIdAndUpdate(userId, { name, email, phone, address }, { new: true })
      .then((updatedUser) => {
        res.render('user-details', { user: updatedUser });
      })
      .catch((err) => {
        console.error('Error updating user in the database', err);
        res.status(500).send('An error occurred');
      });
  });

  
  //It is used to show the details of the user before updated and 
  // after update it shows the updated details.
  router.post('/users/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, phone, address } = req.body;
  
    User.findByIdAndUpdate(userId, { name, email, phone, address  }, { new: true })
      .then((updatedUser) => {
        res.render('user-details', { user: updatedUser });
      })
      .catch((err) => {
        console.error('Error updating user in the database', err);
        res.status(500).send('An error occurred');
      });
  });

  module.exports = router;
  
