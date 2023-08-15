const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema=new Schema({
    emailid:{type:'string', required:true},
    password:{type:'string', required:true}



    
})
 const user = mongoose.model("user", userSchema);
module.exports=user;