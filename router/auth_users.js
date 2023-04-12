const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  if (users.find((user) => user.username === username)) {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );
      res.status(201).send(accessToken);
      // req.session.accessToken = accessToken;
    }
  } else {
    return res
      .status(401)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const rating = req.body.rating;
  const username = req.body.username;
  try {
    if (isbn && review && rating && username) {
      if (isValid(username)) {
        const book = books[isbn];
        if (book) {
          book.reviews.push({
            username: username,
            review: review,
            rating: rating,
          });
          console.log(books[isbn]);
          return res.status(201).json({ message: "Review added successfully" });
        } else {
          return res.status(404).json({ message: "Book not found" });
        }
      } else {
        return res.status(401).json({ message: "User not registered" });
      }
    } else {
      return res.status(400).json({ message: "Invalid request" });
    }
  } catch (error) {
    console.log(error);
  }
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
