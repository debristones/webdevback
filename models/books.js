const mongoose = require('mongoose')
const path = require('path')
const coverImageBasePath = 'uploads/bookCovers'


const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    required: true
  },
  description :{
    type: String,
  },
  publishedDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImageName:{
    type: String,
    required: true
  }
})

bookSchema.virtual('coverImagePath').get(function(){
  if(this.coverImageName != null){
    return path.join('/', coverImageBasePath, this.coverImageName)
  }
})

module.exports = mongoose.model('Books', bookSchema)

module.exports.coverImageBasePath = coverImageBasePath

