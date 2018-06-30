
const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authorEmail: {
        type: String,
        default: 'alexwilkinson@gmail.com'
    },
    body: {
        type: String,
        minlength: 50,
        required: true
    },
    slug: {
        type: String,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    draft: {
        type: Boolean,
        default: true
    },
    publish: {
        type: Date,
        default: Date.now

    },
    lastModified: {
        type: Date
    },
    coverImg: {
        type: String,
        default: ''
    }
});

const blog = mongoose.model('Blog', blogSchema);

module.exports = {
    Blog: blog
}