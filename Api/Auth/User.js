const Router = require("express").Router();
const express=require('express');
const bcrypt= require('bcryptjs');
const app=express();
// aquiring the user schema 
const User= require('../../Modals/user');
//const { findById } = require("../../models/user");

//         signup user CRUD
// step 1: getting the list of users
// step 2: getting the single user against id
// step 3: creating a new user
//        step 3.1: user input validations
//        step 3.2: email format verification and uniqueness
//        step 3.3: registeration format verification and uniqueness
//        step 3.4: password format verification 
//        step 3.5: converting password into hash format
// step 4: updating user name
// step 5: deleting user against user id
//         Login User
// step 6: login using post router
//        step 6.1: Input validations
//        step 6.2: email format verification 
//        step 6.3: password format verification 
//        step 6.4: email and password matching
//step 1
Router.get("/",(req,res)=>
{
    return res.json({message:"Server Runinng",success:true}).status(200);
})
Router.get('/signup',async (req,res) =>{

    try
    {
    const users= await User.find().select('-password');
    return res.json({users,msg:"List of Users", success: true}).status(200);
    }
    catch
    {
        return res.json({msg: " No List Found",success: false}).status(400);
    }
});
// step 2
Router.get('/signup/:id',async (req, res) =>{
    try{
        User.findById(req.params.id).select(-"-password").then(user =>{
            if(!user){ return res.json({msg:" User not found",success:false}).status(400);}
            return res.json({user,msg:"User Found",success:true}).status(200);
            }).catch(err =>{
                return res.json({msg: " User not Exist",success:false}).status(400);
            })
    }
    catch
    {
        return res.json({msg: " User not Exist against that id",success:false}).status(400);
    }
})
// step 3
Router.post('/signup', (req,res) =>{

   
    //step 3.1
    const {user} = req.body;
    let errorMessage=false;// flag
    let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let regExpReg= /[\d]{2}-[ntu|NTU]{3}-[\d]{4}/;
    let passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    if( user.email=== undefined || user.email === " " || (!RegularExpression.test(String(user.email)) )){
        errorMessage="invalid email";
        
    }
    else if(user.reg=== undefined || user.reg === " " || !regExpReg.test(String(user.reg))){
        errorMessage="invalid registeration";
        
    }else if(user.password === undefined || user.password === " " || !passRegex.test(String(user.password))){
        errorMessage="Invalid user password";
    } else if(user.name === undefined || user.name=== " "){
        errorMessage="Invalid user name";
    }
    else
    {
        errorMessage = false;    
    }

    if( errorMessage === false ){
        User.findOne({$or:[{ email:user.email}, {reg:user.reg}]}).then( findUser =>{
            if(findUser !== null)
            {
               
                return res.json( { error: { message: "Email or Reg not unique" ,errorCode: 500} ,success: false} ).status( 500 );
               
            }         
            else
            {
           
                    bcrypt.genSalt(10, (err,salt) => {
                        if(err){
                            // return 
                            return res.json({msg:" Error in salt genrating"}).status(400);               
                        }else{
                            bcrypt.hash(user.password,salt,async (err,hash) => {
                
                            if(err){
                                // return 
                                return res.json({msg:" Error in hash genrating"}).status(400);
                                //errorMessage="errror in hash";
                            }else{
                                const record = new User({
                                email:user.email,
                                reg:user.reg,
                                name:user.name,
                                password: hash
                              })     
                              record.save().then( sUser => {
                                // rturn success
                              return res.json({ message: "User added successfully",user: sUser, success :true}).status(200);   

                              } )
                              .catch( err => {
                                // return
                                return res.json({err:"there is an other while creating user",success:"false"}).status(400);
                              } )
                            } 
                            
                          })
                        }  
                    })
            } 
        })
        .catch( err => {
            return res.json({err:"there is an error while finding user",success:"false"}).status(400);
                    
        } )    
    }else{
        return res.json( { error: { message: errorMessage ,errorCode: 500} ,success: false} ).status( 500 );
    }
})
// step 4
Router.patch('/signup/:id', async(req, res) =>{
    try
    {
        const {name}=req.body;
        if(!name){ return res.json({msg:"name is missing...",success: false}).status(400);}
        const user_name = await User.findById(req.params.id);
        user_name.name=name;
        const up_user_name= await user_name.save();
        return res.json({up_user_name,success:true}).status(200);
    }
    catch
    {
        return res.json({msg :"User with that id not found",success:false}).status(400);
    }
})
// step 5
Router.delete('/signup/:id', async(req,res) =>{
    try
    { 
       User.findByIdAndRemove(req.params.id).exec().then( deleteUser =>{
           if(!deleteUser){
            return res.json({msg:"User id not exists",success:false}).status(400);
           }
           return res.json({deleteUser,success:true,msg:"User Deleted"}).status(200);
       }).catch(err => {
        return res.json({msg:"User Id not found",success:false}).status(400);
       })
    }
    catch
    {
        return res.json({msg :"User with that id not found",success:false}).status(400);
    }
})
// step 6
Router.post('/login', async (req,res) =>{
    try
    {
    const{email,password}=req.body;
    //step 6.1
    if(!email || !password){
        return res.json({msg : " Email or password is missing",success:false}).status(400);

    }
    // step 6.2
    let RegularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( !RegularExpression.test(String(email).toLowerCase() ) ){
        return res.json({ msg: "invalid email" ,success:false}).status(400);
      }
    // step 6.3
    //pass format validation at least at 8 size with uppercase lowercase letter
  let passwordReg=/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
  if(!passwordReg.test(String(password))){
    return res.json({msg:"Invalid Password", success: false}).status( 400 );
  }  
   //step 6.4
   User.findOne({email:email}, (err,user)=>{
       if(err){
           return res.json({msg:" Error in email",success:false}).status(400);
       }
       else if(user == undefined){
           return res.json({msg:"User not found",success:false}).status(400);
       }
       else{
           bcrypt.compare(password,user.password , (err,ismatch)=>{
               if(err){
                   return res.json({msg:" Error in password",success:false}).status(400);
               }
               else if(ismatch===true){
                return res.json({user,msg:" Login Successful",success:true}).status(200);
               }
               else{
                return res.json({msg:"Password Wrong Login Unsuccessful",success:false}).status(400);
               }

           })
       }


   }).catch(err =>{
       return res.json({msg:"Error while matching",success:false}).status(400);
   })
    }
    catch
    {
        return res.json({msg:"Error in Login",success:false}).status(400);
    }

})
module.exports=Router;