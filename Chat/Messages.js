import {
    message,
    getAllMessagesDatas
} from "../Controllers/Controllers-Chat.js";


// to generate new message
async function generateNewMessagesData(req, res) {
    const conversationId = req.params;
    const { receiverId, senderId, messages } = req.body;
    if(messages === undefined || senderId===undefined||receiverId===""){
        return res.status(400).json({message: 'Missing fields'});
    }
    try {
        await message([
            {
                receiverId: receiverId,
                senderId: senderId,
                messages: messages,
                conversationId: conversationId,
            },
        ]);
        return res.status(200).json({
            messages: messages,
            receiverId: receiverId,
            senderId: senderId,
            conversationId: conversationId,
            message: " message sent successfull",
            statusCode: 200,
        });
    } catch (error) {
        console.log(error);
        return res

            .status(500)
            .json({ message: "Internal Server Error", statusCode: 500, error: error });
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
        const allConversationDatas = await getAllMessagesDatas(req);
        console.log(allConversationDatas);
        const specificUserMessages = allConversationDatas.filter(item => {
            return item.conversationId.id === req.params.id;
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
