"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");
const Sequelize = require('sequelize');

//Setup for postgresql
const sequelize = new Sequelize('dc54eboha3966u', 'dbwzanjnuxckzh', 'ed6f98654c7fe8577749fe0dc775253635374faf64649e1bcee44cf06c031dd6', {
  host: 'ec2-54-162-207-150.compute-1.amazonaws.com', 
  dialect: 'postgres', 
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false }
  }
});

sequelize.authenticate()
.then(() => {
  console.log("Postgres DB connected!");
})
.catch((err) => {
  console.log(err);
});

const Chirps = sequelize.define('Chirps', {
  name: Sequelize.STRING,
  handle: Sequelize.STRING,
  avatars: Sequelize.STRING,
  chirp: Sequelize.STRING,
  created_at: Sequelize.BIGINT
});


sequelize.sync()
.then(() => {
  console.log("Postgres connected!");
})
.catch((err) => {
  console.log(err);
})


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
/*       simulateDelay(() => {
        db.tweets.push(newTweet);
        callback(null, true);
      }); */
       simulateDelay(() => {
        Chirps.create({
          name: newTweet.user.name,
          handle: newTweet.user.handle,
          avatars: newTweet.user.avatars,
          chirp: newTweet.content.text,
          created_at: newTweet.created_at
        })
        .then(() => {
          callback(null, true);
        })
        .catch((err) => {
          console.log(err);
        })
      }) 

    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
/*       simulateDelay(() => {
        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        callback(null, db.tweets.sort(sortNewestFirst));
      }); */
       simulateDelay(() => {
        Chirps.findAll({
          order: ['created_at']
        })
        .then((data) => {
          callback(null, data);
        })
        .catch((err) => {
          console.log(err);
        })
      })
    } 

  };
}
