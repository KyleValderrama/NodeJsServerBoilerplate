require('dotenv').config();
const mongoose = require('mongoose');

module.exports = {
    mongooseConnection: function(){
        mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@elearningwebsite.dyt8z.gcp.mongodb.net/ProjectManagementSystem?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true});
    }
}
