import express from "express";
import {
    generateNewConversationData,
    getAllconversationData,
    getSpecificUserconversationData,
} from "../Chat/Conversation.js";
//initalize the router
const router = express.Router();
// To add new Conversation Data
router.post("/", generateNewConversationData);
// To get all Conversation
router.get("/allConversationData", getAllconversationData);
// To get Conversation For specific User
router.get("/specificUser/:id", getSpecificUserconversationData);
export const ConversationdataRouter = router;