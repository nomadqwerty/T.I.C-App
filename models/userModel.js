const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please tell us your name']
    },
    email:{
        type:String,
        required:[true,'please provide your email'],
        unique:true,
        lowerCase:true,
        validate:[validator.isEmail,'Please use a valid email']
    },
    photo:String,
    password:{
        type:String,
        required:[true,'password is required'],
        select:false,
        minLength:[8,'password should be more than 7 characters']
    },
    passwordConfirm:{
        type:String,
        required:[true,'please confirm password'],
        validate:{
            validator:function(val){
                return val == this.password
            },
            message:'Passwords don\'t match'
        }
    },
    passwordChangedAt:{
        type:Date
    }

})

// pre-hook middlesware hash password
userSchema.pre('save',async function(next){
    // function works if password was changed 
    if(!this.isModified('password')) return

    // use bcrypt library to hash the password
    // bcrypt.hash('password',cost=12)
    this.password = await bcrypt.hash(this.password,12)

    this.passwordConfirm = undefined
    next()
})

////////////////////////////////////////
///instance method
userSchema.methods.comparePasswords = async function(userPass,dbPass){
    return await bcrypt.compare(userPass,dbPass)
}
userSchema.methods.passwordChanged = function(JWTtimeStamp){
    if(this.passwordChangedAt){
        const timeStamp = parseInt(this.passwordChangedAt.getTime()/1000,10)

        return JWTtimeStamp < timeStamp
    }
    return false
}
////////////////////////////////////////////////////////////User model
const User = mongoose.model('User',userSchema)


// export model
module.exports = User