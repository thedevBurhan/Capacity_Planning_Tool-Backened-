import {
  toDoList,
  getAlltoDoListDatas,
  updateToDoListData,
  deleteToDoListData,
} from "../Controllers/Controllers-To-Do-list.js";

// To Generate toDoListData

async function generateNewToDoListData(req, res) {
  const { type, date, month,noteHead, notes, userid } = req.body;
  try {
    await toDoList([
      {
        type: type,
        date: date,
        noteHead:noteHead,
        month: month,
        notes: notes,
        userid: userid,
      },
    ]);
    return res.status(200).json({
      type: type,
      noteHead:noteHead,
      notes: notes,
      message: "To Do List create successfull",
      statusCode: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", statusCode: 500 });
  }
}
// To Get All The toDoListData
async function getAlltoDoListData(req, res) {
  try {
    const toDoListData = await getAlltoDoListDatas(req);
    if (toDoListData.length <= 0) {
      res.status(400).json({ data: "To Do List Data Not Found" });
      return;
    }
    res.status(200).json({ toDoListData });
  } catch (error) {
    console.log(error);
    res.send(500).json({ data: "Internal Server Error" });
  }
}

// To get toDoListData For Specific User
async function getSpecificUsertoDoListData(req, res) {
  var alltoDoListDatas = await getAlltoDoListDatas(req);
  try {
    if (alltoDoListDatas > 0) {
      res.status(400).json({ data: "No Data found" });
    } else {
      const alltoDoListData = alltoDoListDatas.filter(
        (item) => item.userid == req.params.id
      );
      // console.log(alltoDoListData);
      res.json({
        message: "To Do List send successfull",
        statusCode: 200,
        alltoDoListData: alltoDoListData.reverse(),
      });
    }
  } catch (error) {
    res.json({
      message: "Internal server error ",
      statusCode: 500,
    });
  }
}
async function getSpecificUserToDoListDataForSpecificCategory(req, res) {
  try {
    var alltodolistdata = await getAlltoDoListDatas(req);
    if (alltodolistdata.length === 0) {
      res.status(400).json({ message: "No Data found", statusCode: 400 });
      return; // Return here to prevent further execution
    }

    const selectedAccountLowercase = req.params.types.toLowerCase(); // Convert selectedAccount to lowercase

    const ToDoListData = alltodolistdata.filter(
      (item) =>
        item.userid == req.params.id &&
        item.type.toLowerCase() == selectedAccountLowercase
    );

    if (ToDoListData.length > 0) {
      res.json({
        message: "To Do List sent successfully",
        statusCode: 200,
        ToDoListData: ToDoListData.reverse(),
      });
    } else {
      res.json({
        message: "No To Do List Data Found for Selected Account",
        statusCode: 202,
        ToDoListData: ToDoListData.reverse(),
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", statusCode: 500 });
  }
}
// To Edit A toDoListData
async function updateToDoListDatas(req, res) {
  try {
    const { id } = req.params;
    const updatedToDoListData = req.body;
    if (!id || !updatedToDoListData) {
      return res.status(400).json({ data: "Wrong Request" });
    }
    const result = await updateToDoListData(id, updatedToDoListData);
    res.status(200).json({
      data: {
        result: result,
        message: "Updated Sucessfully",
        statusCode: 200,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ data: "Internal Server Error" });
  }
}
// To Delete A Specific toDoListData
async function deleteToDoListDatas(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ data: "Wrong Request" });
    } else {
      const result = await deleteToDoListData(id);
      console.log(result);
      res.status(200).json({
        data: {
          result: result,
          statusCode: 200,
          message: "To Do List Deleted Successfully",
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      data: "Internal Server Error",
      message: "Internal server error",
      statusCode: 500,
    });
  }
}
export {
  generateNewToDoListData,
  getAlltoDoListData,
  getSpecificUsertoDoListData,
  getSpecificUserToDoListDataForSpecificCategory,
  updateToDoListDatas,
  deleteToDoListDatas,
};
