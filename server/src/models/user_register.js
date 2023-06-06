const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username :
    {
        type:String,
        required:true
    },
    email:
    { 
        type:String,
        required:true,
        unique :true
    },
    password: { 
        type:String,
        required:true,
    },
    confirmpassword: { 
        type:String,
        required:true,
    },
    phone: {
         
            type:Number,
            required:true,
            unique :true
        
    }
})

const user_register = new mongoose.model("Register",userSchema );

module.export= user_register;