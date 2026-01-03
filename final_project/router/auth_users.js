const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const alreadyExists = users.find((user) => user.username === username);
  if (alreadyExists) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const isAuthenticated = users.find((user) => {
    return user.username === username && user.password === password;
  });
  return isAuthenticated;
};


//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Wrong credentials." });
  }

  const payload = { username: username };
  const token = jwt.sign(payload, "secret", { expiresIn: 60 * 60 });
  req.session.authorization = {
    token,
    username,
  };

  return res.status(200).send(JSON.stringify("User logged in"));
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const token = req.session.authorization["token"];


  const decoded = jwt.verify(token, "secret");
  const username = decoded.username
  const reviewedBook = books[isbn]


  reviewedBook.reviews[username] = review;
  return res.status(200).json({ message: "Review addded successfully", book:reviewedBook });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const token = req.session.authorization["token"];

  const decoded = jwt.verify(token, "secret");
    const username = decoded.username;
      const reviewedBook = books[isbn]

  delete reviewedBook.reviews[username]
    return res.status(200).json({ message: "Review deleted successfully", book:reviewedBook });

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
