import {
    conversation,
    getAllConversationDatas
} from "../Controllers/Controllers-Chat.js";

async function generateNewConversationData(req, res) {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let todayDate = `${day}-${month}-${year}`;
    const { conversationId, receiverId, senderId, messages, userid } = req.body;
    try {
        await conversation([
            {
                members: [{
                    receiverId: receiverId,
                    senderId: senderId
                }],
                messages: messages,
                currentDate: todayDate,
                conversationId: conversationId,
                userid: userid,
            },
        ]);
        return res.status(200).json({
            messages: messages,
            currentDate: todayDate,
            members: [{
                receiverId: receiverId,
                senderId: senderId
            }],
            conversationId: conversationId,
            message: "To Do List create successfull",
            statusCode: 200,
        });
    } catch (error) {
        console.log(error);
        return res

            .status(500)
            .json({ message: "Internal Server Error", statusCode: 500, error: error });
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
        console.log(allConversationDatas);

        if (allConversationDatas.length === 0) {
            return res.status(400).json({ message: "No Data found", statusCode: 400 });
        }

        const specificUserConversations = allConversationDatas.filter(item => {
            return item.conversationId == req.params.id;
        });

        console.log(specificUserConversations);

        res.json({
            message: "Data retrieval successful",
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
