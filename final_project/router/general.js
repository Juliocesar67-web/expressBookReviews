const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username || !password){
        return res.status(404).json({message:"Missing fields."})
  }
  
  if (!isValid(username)){
    return res.status(400).json({message:"This user already exists."})
  }

    users.push({username: username, password:password})
    return res.status(200).json({message:"User registered successfully"})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if (books[isbn]){
    return res.send(JSON.stringify(books[isbn]))
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author
  if (author){
    const booksByAuthor = Object.values(books).filter(book=>{return book.author.replace(" ","").toLowerCase() === author})
    
    if(booksByAuthor.length>0)
    return res.send(JSON.stringify(booksByAuthor));
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  if(title){
    const booksByTitle = Object.values(books).filter(book=>{return book.title.split(" ").join("").toLowerCase()===title})
    if(booksByTitle.length>0){
          return res.send(JSON.stringify(booksByTitle));
    }else{
      return res.status(404).json({message:"No Books Found."})
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  if (isbn){
    return res.send(JSON.stringify(books[isbn].reviews))
  }else{
      return res.status(404).json({message:"No Books Found."})
  }
});

const  asyncAwaitRequests = async ()=>{
  await axios.get("http://localhost:5000/").then((result)=>{console.log(result.data)}).catch((err)=>{console.log(err)})
 await axios.get("http://localhost:5000/isbn/1").then((result)=>{console.log(result.data)}).catch((err)=>{console.log(err)})
}
 
asyncAwaitRequests()
module.exports.general = public_users;
