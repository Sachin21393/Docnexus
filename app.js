const axios = require('axios');
const fs = require('fs');
const express= require('express');
const cheerio = require('cheerio');
const app= express();
let secretkey="secretkey";
const jwt= require("jsonwebtoken");
const mongoose= require("mongoose");
const user=require("./database/models/user")
const {verifyToken}=require("./auth")
const productDetail=require("./database/models/ProductDetail");
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/datavio",{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).catch((err) => {
    console.log("Error connecting to database", err);
    
});



const scrapData=async (url,email)=>{
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('.B_NuCI').text(); // Replace with actual selector
    const price = $('._16Jk6d').text(); 
    const stars=parseFloat($('._2d4LTz').text());
    const description = $('.RmoJUa').text();
    const reviewAndRating = $('._2afbiS').text();
const ratingNumber=parseInt(reviewAndRating.split(' ')[0]);
const reviewNumber=parseInt(reviewAndRating.split(' ')[2].split('&')[1]);
let scrappedData={
    email: email,
    url: url,
    productDetail:[{
        title:title,
        price:price,
        description:description,
        reviewNumber:reviewNumber,
        ratingNumber:ratingNumber,
        Ratings:stars
    }]
}
   return scrappedData;
}
app.post("/scrap",verifyToken,async(req,res)=>{
 const url=req.body.url;
jwt.verify(req.token,secretkey,async(er,auth)=>{
  if(er){

    res.send("invalid")
  }else{
    const checkUrlExist=await productDetail.findOne({ $and: [ { 'email': auth.userDetails.emailid }, { 'url': url} ] });
    if(checkUrlExist){
        res.json({
            data:checkUrlExist
        })
    }else{
    const getData=await scrapData(url,auth.userDetails.emailid);
    const scrappedData=new productDetail({...getData});
    const saveData=await scrappedData.save();
    if(saveData){
        res.json({
            message:"New data saved",
            data:getData.productDetail
        })
    }
}

   
    
  }
})
})
app.post("/login",async(req,res)=>{
 const userDetails=req.body;
 const validateDetails=await user.findOne({ $and: [ { 'emailid': userDetails.emailid }, { 'password': userDetails.password} ] });
 if(validateDetails){
 
        jwt.sign({userDetails},secretkey,{expiresIn: '30000s'},(err,token)=>{
       if(err){
        res.json({
            error:err,
            message:"Failed to generate token"
        })
       }else{
        res.json({
        
            message:"user log in successfull",
            token:token
        })
       }
            })
    }
 else{
    res.json({
    message:"Login failed due to invalid credentials"
    })
 }


 

})
app.post("/signup",async(req,res)=>{
const userDetails=req.body;
console.log(userDetails)
const saveUserDetail=new user({...userDetails});
const saveUser=await saveUserDetail.save();
if(saveUser){
    res.status(201).json({
        message:"new user created"
    })
}else{
    res.json({
        message:"failed to create new user"
    })
}
})
app.get('/',async (req,res)=>{
  const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const title = $('.B_NuCI').text(); // Replace with actual selector
    const price = $('._16Jk6d').text(); 
    const stars=$('._2d4LTz').text();
    const rating=$('._3LWZlK').text();
    const description = $('.RmoJUa').text();
    const review = $('._2afbiS').text();
    console.log("price",price)
    console.log("===",title, price,review,stars,description);
})
app.listen(80,()=>{
  console.log('listening on port 80');
})