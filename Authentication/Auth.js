import jwt from "jsonwebtoken"
import dotenv from "dotenv"
//configure thhe environment
dotenv.config();
const SECRETKEY=process.env.SECRETKEY 

export async function isAuthenticated(req,res,next){
     //check if access is give
     const token=req.headers["authtoken"];
     if( ! token){
       return res.status(400).json({data:"Invalid Authorization"})
     }
   jwt.verify(token,SECRETKEY)
//middleware to say move on to next method 
   next();
}