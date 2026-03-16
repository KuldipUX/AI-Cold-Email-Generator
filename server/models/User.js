const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
         unique: true,
       
    },
    password:{
        type:String,
        required:true,
        minlength:6,

    },
   username:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        defaut:false
    },
    otp:{
        type:String
    },
    otpExpiry:{
        type:Date
    }
})
//Hash password before saving
//PW - SHIVA@123 -> sbchsvnznbkbdcvnvscsy
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

//Compare password for login 
//candidatePassword - SHIVA@123 -> sbchsvnznbkbdcvnvscsy
userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
}

const User = mongoose.model('User',userSchema);
module.exports= User;