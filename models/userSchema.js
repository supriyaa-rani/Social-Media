const mongoose = require('mongoose')

const plm = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    fullname: {
        type:String,
        trim:true,
        required:[true, 'Full Name is required'],
        minLength:[4, 'Full Name must be 4 characters long']
    },
    username: {
        type:String,
        trim:true,
        unique:true,
        required:[true, 'Username is required'],
        minLength:[4, 'Username must be 4 characters long']
    },
    email: {
        type:String,
        trim:true,
        required:[true, 'Email  is required'],
        unique:true,
        lowercase:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password:String,
}, {timestamps:true})

userSchema.plugin(plm)

const User = mongoose.model('user', userSchema)

module.exports = User