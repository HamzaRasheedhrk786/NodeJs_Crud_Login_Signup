const mongoose = require('mongoose');

// defining user schema
const userSchema= new mongoose.Schema({
    email:{
        type: String,
        required : true,
    
    },
    reg:{
        type : String,
        max: 11,
        min:11,
        required: true,
    },
    name:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required :true,
    }

});
module.exports= mongoose.model('User',userSchema);
