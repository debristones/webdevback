const express = require('express');
const router = express.Router();
const Author = require('../models/author');

// GET all authors
router.get('/', async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== ''){
    searchOptions.name = new RegExp(req.query.name, 'i');
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render('authors/index',
      {
      authors: authors ,
      searchOptions: req.query
      }
    );
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// GET form to create a new author
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() });
});

// POST create a new author
router.post('/', async (req, res) => {
  const author = new Author({ name: req.body.name });

  try {
    await author.save();
    res.redirect('/authors'); // ensure leading '/' for absolute path
  } catch (err) {
    console.error(err);
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error creating author'
    });
  }
});

module.exports=router;