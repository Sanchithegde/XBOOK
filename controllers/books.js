const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");
const spawn= require('child_process').spawn

const { postBookValidator } = require("../validators/joi-validator");
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (err) {
    return res.status(404).json({ msg: "No Book Found" });
  }
};

exports.createBookAd = async (req, res) => {
  const book = req.body;
  const { error } = postBookValidator.validate(req.body);

  console.log(book)

  if (!req.userId) return res.status(403).json({ msg: "Unauthorized" });
  try {
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
    const {tags}=req.body
    const { selectedFile } = req.body;
    // console.log(req.file)
    // const img_url=req.file.location
    const noOfPages = Number(book.noOfPages);
    const price = Number(book.price);
    const mrp = Number(book.mrp);

    const newBook = new Book({
      ...book,
      noOfPages: noOfPages,
      price: price,
      // selectedFile:img_url,
      selectedFile,
      mrp: mrp,
      tags,
      owner: req.userId,
      wishListedBy: [],
      createdAt: new Date().toISOString(),
    });
    await newBook.save();

    const currentUser = await User.findById(req.userId);
    const books = currentUser.postedBooks;
    books.push(newBook._id);
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { postedBooks: books },
      { new: true }
    );
    updatedUser.save();

    return res.status(201).json({ msg: "Added" });
  } catch (err) {
    console.log(err)
    return res.status(409).json({ msg: "Something went wrong on Server.." });
  }
};

exports.recSystem=async(req,res)=>{
  const {title}=req.body

  
var pyspawn = spawn(
  'python', ['./recommendation.py', 'Engineering Drawing']
);

pyspawn.stdout.on('data',(data)=>{

  var buf = Buffer.from(JSON.stringify(obj));
  var temp = JSON.parse(buf.toString());
  console.log(temp)
  // return res.json({status:"ok",})
})


pyspawn.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

}

exports.addToWishList = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.status(403).json({ msg: "Unauthorized access" });

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: `No Book with id:${id}` });

  try {
    const book = await Book.findById(id);
    const userId = book.wishListedBy.findIndex(
      (id) => id === String(req.userId)
    );

    if (userId == -1) {
      book.wishListedBy.push(req.userId);
    } else {
      book.wishListedBy = book.wishListedBy.filter(
        (id) => id !== String(req.userId)
      );
    }

    const updatedBook = await Book.findByIdAndUpdate(id, book, { new: true });
    return res.json(updatedBook);
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong on Server.." });
  }
};

exports.updateIsSold = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `No Book with id:${id}` });

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { isSold: true },
      { new: true }
    );
    return res.json(updatedBook);
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong on Server.." });
  }
};

exports.deleteaBook = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `No Book with id:${id}` });

    await Book.findByIdAndRemove(id);
    return res.status(204).json({ msg: "Book Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong on Server.." });
  }
};

exports.editBook = async (req, res) => {
  const { id } = req.params;
  const toUpDate = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: `No Book with id:${id}` });

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { ...toUpDate, updatedAt: new Date().toISOString() },
      { new: true }
    );
    return res.status(200).json(updatedBook);
  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong on Server.." });
  }
};
