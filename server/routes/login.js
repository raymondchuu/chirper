const express = require('express');
const loginRoutes = express.Router();
const dataServiceAuth = require('../lib/data-service-auth');

loginRoutes.get("/", (req, res) => {
    res.render("login");
})

loginRoutes.post('/', (req, res) => {
    dataServiceAuth.checkUser(req.body)
    .then((response) => {
        req.session.user = {
            name: response.name,
            handle: response.handle,
        }
        res.redirect("/");
    })
    .catch((err) => {
        res.render("login"), {
            errorMessage: err, 
            handle: req.body.handle
        }
    })
})

module.exports = loginRoutes;