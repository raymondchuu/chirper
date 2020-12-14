const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    "handle": {
        "type": String, 
        "unique": true
    },
    "name": String,
    "password": String
});

let User;

module.exports.initialize = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect("mongodb+srv://admin:laptop1234@twitter-clone.tfqcu.mongodb.net/twitter-clone-users?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            User = mongoose.model("users", userSchema);
            console.log("DB connected!");
            resolve();
        })
        .catch((err) => {
            reject(err);
        })
    })
}

module.exports.registerUser = (data) => {
    return new Promise((resolve, reject) => {
        console.log(data);
        if (data.firstName.trim() === "" || data.lastName.trim() === "" || data.handle.trim() === "" || data.password.trim() === "") {
            reject("Username, handle, or password cannot be empty or only white spaces!");
        }

        if (data.handle[0] !== '@') {
            reject("Handle must begin with @")
        }

        if (data.password.length < 6) {
            reject("Password must be at least 6 characters long!");
        }

        if (data.password !== data.password2) {
            reject("Passwords do not match!");
        }

        if (data.password === data.password2) {
            bcrypt.hash(data.password, 10)
            .then(hashVal => {
                const newUser = new User({
                    name: data.firstName + " " + data.lastName,
                    handle: data.handle,
                    password: hashVal,
                });
    
                newUser.save((err) => {
                    if (err) {
                        if (err.code === 11000) {
                            reject("Handle already taken");
                        }
                        reject("Unable to create account");
                    }
    
                    else {
                        resolve();
                    }
                })
            })
        }

    })
}

module.exports.checkUser = (data) => {
    return new Promise((resolve, reject) => {
        if (data.handle.trim() === "" || data.password.trim() === "") {
            reject("Enter your handle and password to login!");
        }

        if (data.handle && data.password) {
            User.findOne({
                handle: data.handle 
            })
            .exec()
            .then((foundUser) => {
                bcrypt.compare(data.password, foundUser.password)
                .then((res) => {
                    if (res) {
                        resolve(foundUser);
                    }
                    else {
                        reject("Unable to verify user!");
                    }
                })
                .catch((err) => {
                    reject("Incorrect password!");
                })
            })
        }

    })
}