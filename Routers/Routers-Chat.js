import express from "express";
import {
    generateNewConversationData,
    getAllconversationData,
    getSpecificUserconversationData,
   
} from "../Chat/Conversation.js";
import {generateNewMessagesData, getSpecificUserMessagesData,getAllMessagesData} from "../Chat/Messages.js";

//initalize the router
const router = express.Router();
// To add new Conversation Data
router.post("/", generateNewConversationData);
// To get all Conversation
router.get("/allConversationData", getAllconversationData);
// To get Conversation For specific User
router.get("/specificUser/:id", getSpecificUserconversationData);
// To add new message Data
router.post("/messages/", generateNewMessagesData);
// To get all messages data
router.get("/allMessagesData", getAllMessagesData);
// To get messages data/list For specific User
router.get("/messages/specificUser/:id", getSpecificUserMessagesData);
export const ConversationdataRouter = router;