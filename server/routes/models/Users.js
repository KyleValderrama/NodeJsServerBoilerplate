const mongoose = require('mongoose');

const UsersSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    onlineStatus: Boolean,
    publicStatus: String,
    username: String,
    bio: String,
    profilePhotoUrl: String,
    projects: {
        messageId: mongoose.Schema.Types.ObjectId
    },
    notifications: {
        notificationId: mongoose.Schema.Types.ObjectId
    },
    dateCreated: Date,
    dateInfoUpdated: Date,
});

module.exports = mongoose.model('Users', UsersSchema);