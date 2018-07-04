const mongoose = require('mongoose');

const siteSettingsSchema = mongoose.Schema({

});

const siteSettings = mongoose.model('SiteSettings', siteSettingsSchema);

module.exports = {
    SiteSettings: siteSettings
}