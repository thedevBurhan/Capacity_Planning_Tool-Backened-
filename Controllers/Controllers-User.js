import { client } from "../Database/Db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//configure thhe environment
dotenv.config();
const SECRETKEY = process.env.SECRETKEY;

export function addUsers(userInfo) {
  return client
    .db("Capacity_Planning_Tool")
    .collection("Users")
    .insertOne(userInfo);
}

export function getUser(userEmail) {
  return client
    .db("Capacity_Planning_Tool")
    .collection("Users")
    .findOne({ email: userEmail });
}

export function generateJwtToken(id) {
  return jwt.sign({ id }, SECRETKEY, { expiresIn: "1d" });
}
//To get details by key &value
export function getAllUsers(req) {
  return client
    .db("Capacity_Planning_Tool")
    .collection("Users")
    .find(req.query) //get by our requirement in postman
    .toArray();
}
