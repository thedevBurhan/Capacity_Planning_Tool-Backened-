import { client } from "../Database/Db.js";
import { ObjectId } from "mongodb";
 
// Addding To_Do_List to todoList

export function toDoList(toDoList){
    return client
    .db("Capacity_Planning_Tool")
    .collection("To_Do_List")
    .insertMany(toDoList)
}

// Getting all To_Do_Lists
export function getAlltoDoListDatas(req){
    return client
    .db("Capacity_Planning_Tool")
    .collection("To_Do_List")
    .find(req.query)
    .toArray();
}

// To Edit The ToDoList Data
export function updateToDoListData(id,updatedToDoListData){
    return client
    .db("Capacity_Planning_Tool")
    .collection("To_Do_List")
   .findOneAndUpdate({_id:new ObjectId(id)},{$set:updatedToDoListData})
}
//  To delete a Specific ToDoList Data

export function deleteToDoListData(id){
    return client
    .db("Capacity_Planning_Tool")
    .collection("To_Do_List")
    .deleteOne({_id:new ObjectId(id)}); 
}