/**
 * Not currently in use
 * need to consider best way to implement
 */
const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    }
})

const portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = {
    Portfolio: [portfolio]
}