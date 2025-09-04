const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../models/books');
const uploadPath = path.join('public', Book.coverImageBasePath);
const Authors = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const upload = multer ({
  dest: uploadPath,
  fileFilter:(req, file, callback) =>{
  callback(null, true)
  }
})


// GET all books
router.get('/', async (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
   query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
   query = query.lte('publishedDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
   query = query.gte('publishedDate', req.query.publishedAfter)
  }
  try{
    const books = await query.exec()
    res.render('books/index', {
    books: books,
    searchOptions: req.query
  });
  }catch{
    res.redirect('/')
  } 
});



// GET form to create a new book
router.get('/new', async (req, res) => {
  res.render('books/new', {
     authors: await Authors.find({}), 
     book : new Book(),
     errorMessage: ''
});
});

 // POST to create a new book
router.post('/',upload.single('cover'), async (req, res) =>{ 
  const fileName = req.file != null ? req.file.filename : null
  const bookInfo = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      publishedDate: new Date(req.body.publishedDate),
      pageCount: req.body.pageCount,
      coverImageName: fileName
    })
  try{ 
     const newBook = await bookInfo.save()
     res.redirect('/books');
  } catch (error){
    /*
    if (bookInfo.coverImageName != null){
      removeBookCover(bookInfo.coverImageName)
      res.errorMessage = 'You have not chossen a file'
    }*/

    const missingFields = [];
    for (const field in bookInfo.toObject()) {
      if (
        !bookInfo[field] ||
        (typeof bookInfo[field] === 'string' && (typeof bookInfo[field].trim() === ''))
      ) {
        missingFields.push(field);
      }
    }

    let errorMessage = '';
    if (missingFields.length > 0) {
      errorMessage = `Please fill in the following: ${missingFields.join(', ')};`
    } else {
      errorMessage = 'Error creating book';
    }  try {
      const authors = await Authors.find({});
      res.render('books/new', {
        authors: authors,
        book: bookInfo,
        errorMessage: errorMessage
      });
    } catch (err) {
      console.error(err);
      res.redirect('/books/new');
}    
  }
});

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.error(err)
  })
}

// Validation middleware
function validateBookFields(req, res) {
  const { title, author, publishedDate, pageCount } = req.body;
  // Simple check – you can extend this
  if (!title || !author || !publishedDate || !pageCount) {
    // Render the page immediately with an error (no file uploaded yet)
     res.errorMessage = 'Error Creaertyuiting Book'
  }
}


module.exports=router;




