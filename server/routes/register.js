const express = require('express');
const registerRoutes = express.Router();
//const dataServiceAuth = require('../lib/data-service-auth');

module.exports = (dataServiceAuth) => {
    registerRoutes.get("/", (req, res) => {
        res.render("./register");
    })
    
    registerRoutes.post("/", (req, res) => {
        dataServiceAuth.registerUser(req.body)
        .then((response) => {
            res.render("register", {
                successMessage: "User created!"
            });
        })
        .catch((err) => {
            res.render("register", {
                errorMessage: err,
                userName: req.body.handle
            })
        })
    })
    return registerRoutes
}
