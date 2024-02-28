import { client } from "../Database/Db.js";
import { ObjectId } from "mongodb";
 
// Addding Conversation to conversation

export function conversation(conversation){
    return client
    .db("Capacity_Planning_Tool")
    .collection("Conversation")
    .insertMany(conversation)
}
export function message(messages){
    return client
    .db("Capacity_Planning_Tool")
    .collection("Message")
    .insertMany(messages)
}
// Getting all Conversation
export function getAllMessagesDatas(req){
    return client
    .db("Capacity_Planning_Tool")
    .collection("Message")
    .find(req.query)
    .toArray();
}
// Getting all Conversation
export function getAllConversationDatas(req){
    return client
    .db("Capacity_Planning_Tool")
    .collection("Conversation")
    .find(req.query)
    .toArray();
}