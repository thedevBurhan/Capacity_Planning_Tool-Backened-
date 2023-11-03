import express from "express";
import { addUsers, generateJwtToken, getUser,getAllUsers} from "../Controllers/Controllers-User.js";
import bcrypt from "bcrypt";
//initalize the router
const router=express.Router();


router.post("/signup",async(req,res)=>{
    try {
        //creating/generating salt (generate random string)
        //random bits added to each password instance before its hashing. Salts create
        // unique passwords even in the instance of two users 
        //choosing the same passwords
        const salt= await bcrypt.genSalt(10);
        const user=await getUser(req.body.email);
        if(!user){
            //hashing the password and salt (encrypted data)
          //Hashing is the process of transforming any given key or a string of characters into another value. 
            const hashedPassword=await bcrypt.hash(req.body.password,salt);
          
            const hashedUser=await {...req.body,password:hashedPassword}
          const result= await addUsers(hashedUser)
            return res.status(200).json({result,data:"Added Sucessfully"})
        }
        res.status(400).json({data:"Given email already exist"})
    } catch (error) {
        console.log(error)
        res.send(500).json({data:"Internal Server Error"}).send(`Internal Server Error`);
     
    }
})

router.post("/login",async(req,res)=>{
    try {
        //is user available
        var user=await getUser(req.body.email);
        // console.log(user)
        if(!user){
            
          return  res.status(404).json({data:{message:"User Not Found",result:user,user:user,statusCode:404}})
        }
        //is password is valid
        const validPassword=await bcrypt.compare(
            req.body.password,
            user.password
        )//compare my hashed and password in req.body
        if(!validPassword){
            return res.status(400).json({data:{message:"Invalid Password",result:validPassword,statusCode:400,user:user}})
        }
        // token
        const token=await generateJwtToken(user._id);
        res.status(200).json({data:{message:"Sucessfully Logged In",result:validPassword,statusCode:200,token:token,user:user}})
    } catch (error) {
        console.log(error)
        res.send(500).json({data:"Internal Server Error"})
     
    }
})

router.get("/all",async(req,res)=>{
    
    try {
    const users = await getAllUsers(req)
          if(users.length<=0){
            res.status(400).json({data:"User Not Found"})
            return
          }
           res.status(200).json({data:users})
      } catch (error) {
         console.log(error)
         res.send(500).json({data:"Internal Server Error"})
      }
       
})
export const usersRouter=router;  