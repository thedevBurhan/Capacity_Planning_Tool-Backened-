import {
    message,
    getAllMessagesDatas,
    conversation
} from "../Controllers/Controllers-Chat.js";
import { ObjectId } from "mongodb";

// to generate new message
async function generateNewMessagesData(req, res) {
    try {
        const { receiverId, senderId, messages, userid, conversationId } = req.body;

        // Check if required fields are filled
        if (!messages || !senderId) {
            return res.status(400).json({ message: 'Please fill all required fields message and senderid', statusCode: 400 });
        }

        // Create a new conversation if conversationId is 'new' and receiverId is provided
        if (conversationId == "" && receiverId) {
            const CreatingConversationId = new ObjectId();
            const newConversationResult = await conversation([
                {
                    members: [{ receiverId, senderId }],
                    userid: userid,
                    conversationId: CreatingConversationId,
                },
            ]);
        

            // Create new message in the newly created conversation
            const newMessageResult = await message([
                {
                    receiverId,
                    senderId,
                    messages,
                    conversationId: CreatingConversationId,
                },
            ]);

            return res.status(200).json({
                messages,
                receiverId,
                senderId,
                conversationId: CreatingConversationId,
                message: 'Message sent successfully',
                statusCode: 200,
            });
        } else if (conversationId) {
            // If conversationId provided, add message to existing conversation
            const newMessageResult = await message([
                {
                    receiverId,
                    senderId,
                    messages,
                    conversationId,
                },
            ]);

            return res.status(200).json({
                messages,
                receiverId,
                senderId,
                conversationId,
                message: 'Message sent successfully',
                statusCode: 200,
            });
        } else {
            return res.status(400).json("Please fill all required fields")
        }
    } catch (error) {
        console.error('Error generating new message:', error);
        return res.status(500).json({ message: 'Internal Server Error', statusCode: 500, error: error });
    }
}



// To Get All The Messages
async function getAllMessagesData(req, res) {
    try {
        const messagesData = await getAllMessagesDatas(req);
        if (messagesData.length <= 0) {
            res.status(400).json({ data: "Messages Data Not Found" });
            return;
        } messagesData
        res.status(200).json({ messagesData });
    } catch (error) {
        console.log(error);
        res.send(500).json({ data: "Internal Server Error" });
    }
}
// To get messages Data For Specific User
async function getSpecificUserMessagesData(req, res) {
    try {
        const conversationId = req.params.id;
        if (conversationId == "") return res.status(200).json([]);
        const allConversationDatas = await getAllMessagesDatas(req);
        console.log(allConversationDatas);
        const specificUserMessages = allConversationDatas.filter(item => {
            return item.conversationId === conversationId;
        });

        console.log(specificUserMessages);

        res.json({
            message: "successful",
            statusCode: 200,
            allConversationData: specificUserMessages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error", statusCode: 500 });
    }
}


export {
    generateNewMessagesData,
    getAllMessagesData,
    getSpecificUserMessagesData
};
