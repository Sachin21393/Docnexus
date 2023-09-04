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
const blogDetails=require("./database/models/blogdetails");
app.use(express.json());
mongoose.connect("mongodb://127.0.0.1:27017/DocNexus",{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).catch((err) => {
    console.log("Error connecting to database", err);
    
});





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
app.post("/createPost",verifyToken,async(req,res)=>{
    const url=req.body.url;
   jwt.verify(req.token,secretkey,async(er,auth)=>{
     if(er){
   
       res.send("invalid login")
     }else{
       const userData=await user.findOne({emailid:req.data.emailid})
       const blogData=req.body.data;
       const saveData=new blogDetails({...blogData,author:userData._id});
       try{
       const response= await saveData.save();
   
       if(response){
           res.json({
               "data": response,
               "status": "success"
           })
       }else{
           res.json({
               "status": "failed to save"
           })
       }
   }catch(e){
     console.log(e)
   }
      
   }
   
      
       
     
   })
   })

   app.put("/updatePost/:postId",verifyToken,async(req,res)=>{
    const url=req.body.url;
   jwt.verify(req.token,secretkey,async(er,auth)=>{
     if(er){
   
       res.send("invalid login")
     }else{
       const userData=await user.findOne({emailid:req.data.emailid})
       const blogData=req.body.data;
       const saveData=new blogDetails({...blogData,author:userData._id});
       
        try {
            const { postId } = req.params;
            const { title, content } = req.body;
    
  
            const blogPost = await blogDetails.findById(postId);
            if (!blogPost) {
                return res.send('Blog post not found.');
            }
    
            blogPost.title = title;
            blogPost.content = content;
            await blogPost.save();
    
            res.json({
               "message": "Blog post updated successfully",
                "status": "success"
            })
        } catch (error) {
            console.error(error);
       res.send("not able to update blog post")
        }
    
    }
    })
   })

   // Delete a blog post by ID
app.delete('/deletePost/:postId', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;

        const blogPost = await blogDetails.findByIdAndDelete(postId)
        if (!blogPost) {
            return res.send('Blog post not found.');
        }
       
    
        res.json({
            "message": "Blog post deleted successfully",
             "status": "success"
         })
    } catch (error) {
        console.error(error);
      
    }
});

app.get('/getposts', async (req, res) => {
    try {
        
        const blogPosts = await blogDetails.find().populate('author');

    
        res.json(blogPosts);
    } catch (error) {
        console.error(error);
    
    }
});


app.listen(80,()=>{
  console.log('listening on port 80');
})