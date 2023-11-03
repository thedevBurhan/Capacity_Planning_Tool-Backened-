import { client } from "../Database/Db.js";
import { ObjectId } from "mongodb";
 
// Addding Time_Sheet to timeSheet

export function timeSheet(timeSheet){
    return client
    .db("Capacity_Planning_Tool")
    .collection("Time_Sheet")
    .insertMany(timeSheet)
}
// Getting all Time_Sheet
export function getAllTimeSheetDatas(req){
    return client
    .db("Capacity_Planning_Tool")
    .collection("Time_Sheet")
    .find(req.query)
    .toArray();
}
// To Edit The timeSheet Data
export function updateTimeSheetData(id,updatedTimeSheetData){
    return client
    .db("Capacity_Planning_Tool")
    .collection("Time_Sheet")
   .findOneAndUpdate({_id:new ObjectId(id)},{$set:updatedTimeSheetData})
}

//  To delete a Specific timeSheet Data

export function deletetimeSheetData(id){
    return client
    .db("Capacity_Planning_Tool")
    .collection("Time_Sheet")
    .deleteOne({_id:new ObjectId(id)}); 
}