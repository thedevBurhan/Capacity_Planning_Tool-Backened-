import {
    message,
    getAllMessagesDatas,
    conversation
} from "../Controllers/Controllers-Chat.js";


// to generate new message
async function generateNewMessagesData(req, res) {
    try {
        const { receiverId, senderId, messages, userid, conversationId } = req.body;

        // Check if required fields are filled
        if (!messages || !senderId) {
            return res.status(400).json({ message: 'Please fill all required fields', statusCode: 400 });
        }

        // If no conversationId provided, create a new conversation
        if (!conversationId && receiverId) {
            const newConversationResult = await conversation([
                {
                    members: [{ receiverId, senderId }],
                    userid: userid,
                },
            ]);
            const newConversationId = newConversationResult.insertedIds[0];
            // console.log("neConversationId",newConversationId);
            // console.log(newConversationResult);                  
            // Create new message in the newly created conversation
            const newMessageResult = await message([
                {
                    receiverId,
                    senderId,
                    messages,
                    conversationId: { id: newConversationId },
                },
            ]);

            return res.status(200).json({
                messages,
                receiverId,
                senderId,
                conversationId: { id: newConversationId },
                message: 'Message sent successfully',
                statusCode: 200,
            });
        } else {
            return res.status(400).json("Please fill all required fields")
        }

        // If conversationId provided, add message to existing conversation
        const newMessage = await message([
            {
                receiverId,
                senderId,
                messages,
                conversationId,
            },
        ]);
        console.log(newMessage, "newMessage");
        return res.status(200).json({
            messages,
            receiverId,
            senderId,
            conversationId,
            message: 'Message sent successfully',
            statusCode: 200,
        });
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
        if (conversationId == "new") return res.status(200).json([]);
        const allConversationDatas = await getAllMessagesDatas(req);
        console.log(allConversationDatas);
        const specificUserMessages = allConversationDatas.filter(item => {
            return item.conversationId.id === conversationId;
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
