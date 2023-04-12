const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
    users.push({ username: username, password: password });
    console.log(JSON.stringify(users));
    return res.status(200).json({ message: "User registered successfully" });
  }
  console.log(Json.stringify(users));
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const allBooks = books;
  return res.status(200).json(allBooks);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    Promise.resolve(book)
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      });
  } else {
    Promise.reject(new Error("Book not found")).catch((error) => {
      console.error(error);
      res.status(404).json({ message: "Book not found" });
    });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;
  let bookList = [];
  for (let book in books) {
    if (books[book].author == author) {
      bookList.push(books[book]);
    }
  }
  if (bookList.length > 0) {
    return res.status(201).json(bookList);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;
  let bookList = [];
  for (let book in books) {
    if (books[book].title == title) {
      bookList.push(books[book]);
    }
  }
  if (bookList.length > 0) {
    return res.status(201).json(bookList);
  }
  return res.status(404).json({ message: "Book not found" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(201).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
