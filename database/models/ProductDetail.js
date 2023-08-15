const mongoose = require("mongoose");
const { Schema } = mongoose;
const {user}=require("./user")

const productDetailScehma=new Schema({
   email:{type:String},
    url:{type:String},
productDetail:[{
    title:{type:String},
    price:{type:String},
    description:{type:String},
    reviewNumber:{type:Number},
    ratingNumber:{type:Number},
    Ratings:{type:Number}
}]




    
})
 const productDetail = mongoose.model("productDetail", productDetailScehma);
module.exports=productDetail;