const mongoose = require("mongoose");
const { Schema } = mongoose;
const {user}=require("./user")

const blogSchema = new Schema({
    title: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
});



    
 const blogDetails = mongoose.model("blogDetails", blogSchema);
module.exports=blogDetails;