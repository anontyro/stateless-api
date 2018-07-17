/**
 * @class BLOG SCHEMA
 * Class that holds all of the blog data to be updated on the site
 * This class is the main section for personal writing on the site and
 * generated the slug prior to adding to the database to create a unique
 * link to use
 */
const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    /** Title for the current blog post */
    title: {
        type: String,
        required: true
    },
    /** defaults to my email but can be set to an email in the person schema */
    authorEmail: {
        type: String,
        default: 'alexwilkinson@gmail.com'
    },
    /** Main content of the blog post, this section will hold the majority of the content which will be saved
     * as html to provide rich text edtiing
     */
    body: {
        type: String,
        minlength: 50,
        required: true
    },
    /** Unique post identifier that allows this post to be linked correctly */
    slug: {
        type: String,
        unique: true,
    },
    /** Date this post was created defaults to now and should not be changed */
    date: {
        type: Date,
        default: Date.now
    },
    /** Boolean set to true if this post is draft, drafts by default are not publicly visiable */
    draft: {
        type: Boolean,
        default: true
    },
    /** Date this post should be published, still requires draft to be false */
    publish: {
        type: Date,
        default: Date.now

    },
    /** Automatically updated with update method this displays the last modified date no default */
    lastModified: {
        type: Date
    },
    /** Image to be displayed on the cover, contains the default location */
    coverImg: {
        type: String,
        default: 'img/default.png'
    },
    /** String[] which allows for related tags to be added, this makes it easier to group posts */
    tags: [{
        type: String
    }]
});

const blog = mongoose.model('Blog', blogSchema);

module.exports = {
    Blog: blog
}