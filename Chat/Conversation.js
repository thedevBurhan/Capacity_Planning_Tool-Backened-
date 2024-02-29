import {
    conversation,
    getAllConversationDatas
} from "../Controllers/Controllers-Chat.js";
import { ObjectId } from "mongodb";

// to generate new conversation
async function generateNewConversationData(req, res) {
    const { receiverId, senderId, userid } = req.body;
    try {
        // Generate the conversation ID
        const CreatingConversationId = new ObjectId();

        // Insert the new conversation
        const newConversation = await conversation([
            {
                members: [{
                    receiverId: receiverId,
                    senderId: senderId
                }],
                conversationId: CreatingConversationId,
                userid: userid,
            },
        ]);
        
        return res.status(200).json({
            members: [{
                receiverId: receiverId,
                senderId: senderId
            }],
            conversationId: CreatingConversationId,
            userid: userid,
            message: "successful",
            statusCode: 200,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error", statusCode: 500, error: error });
    }
}


// To Get All The conversation
async function getAllconversationData(req, res) {
    try {
        const conversationData = await getAllConversationDatas(req);
        if (conversationData.length <= 0) {
            res.status(400).json({ data: "Time Sheet Data Not Found" });
            return;
        } conversationData
        res.status(200).json({ conversationData });
    } catch (error) {
        console.log(error);
        res.send(500).json({ data: "Internal Server Error" });
    }
}
// To get conversation Data For Specific User
async function getSpecificUserconversationData(req, res) {
    try {
        const allConversationDatas = await getAllConversationDatas(req);
        // console.log(allConversationDatas);

        if (allConversationDatas.length === 0) {
            return res.status(400).json({ message: "No Data found", statusCode: 400 });
        }

        const specificUserConversations = allConversationDatas.filter(item => {
            return item.members.some(member => member.senderId == req.params.id && item.conversationId == req.params.ConId);
        });

        res.json({
            message: "successful",
            statusCode: 200,
            allConversationData: specificUserConversations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
}




export {
    generateNewConversationData,
    getAllconversationData,
    getSpecificUserconversationData
};
