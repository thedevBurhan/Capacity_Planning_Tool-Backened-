import {
  timeSheet,
  getAllTimeSheetDatas,
  updateTimeSheetData,
  deletetimeSheetData,
} from "../Controllers/Controllers-Time-Sheet.js";

// To Generate timeSheet

async function generateNewTimeSheetData(req, res) {
  const { MTimeIn, MTimeOut, ATimeIn, ATimeOut, userid } = req.body;
  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();
  let todayDate = `${day}-${month}-${year}`;
  // Parse and format time strings
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    return `${hours.padStart(2, "0")}.${minutes}`;
    // The padStart() method pads a string from the start.
    //It pads the string with another string (multiple times) until it reaches a given length.
    //let text = "5";
    // text = text.padStart(4,"0");===>is 0005
  };
  // Parse time strings to JavaScript Date objects
  const parsedMTimeIn = formatTime(MTimeIn);
  //   console.log("parsedMTimeIn:",parsedMTimeIn);
  const parsedMTimeOut = formatTime(MTimeOut);
  //   console.log("parsedMTimeOut:",parsedMTimeOut);
  const parsedATimeIn = formatTime(ATimeIn);
  //   console.log("parsedATimeIn:",parsedATimeIn);
  const parsedATimeOut = formatTime(ATimeOut);
  //   console.log("parsedATimeOut:",parsedATimeOut);

  // Calculate time differences in milliseconds
  const MTimeDifference = +parsedMTimeOut - +parsedMTimeIn;
  const ATimeDifference = +parsedATimeOut - +parsedATimeIn;
  //   console.log("MTimeDifference:",MTimeDifference);
  //   console.log("ATimeDifference:",ATimeDifference);
  const MHours = MTimeDifference;
  const AHours = ATimeDifference;

  // Calculate total hours worked
  const totalHours = Math.ceil(MHours + AHours);
  //   console.log(totalHours);
  //   Math.ceil() rounds a number UP to the nearest integer
  try {
    await timeSheet([
      {
        currentDate: todayDate,
        MTimeIn: MTimeIn,
        MTimeOut: MTimeOut,
        ATimeIn: ATimeIn,
        ATimeOut: ATimeOut,
        TotalHours: totalHours,
        userid: userid,
      },
    ]);
    return res.status(200).json({
      currentDate: todayDate,
      TotalHours: totalHours,
      message: "Today Time Sheet Added successfull",
      statusCode: 200,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", statusCode: 500 });
  }
}
// To Get All The timeSheet
async function getAllTimeSheetData(req, res) {
  try {
    const timeSheetData = await getAllTimeSheetDatas(req);
    if (timeSheetData.length <= 0) {
      res.status(400).json({ data: "Time Sheet Data Not Found" });
      return;
    }
    res.status(200).json({ timeSheetData });
  } catch (error) {
    console.log(error);
    res.send(500).json({ data: "Internal Server Error" });
  }
}

// To get timeSheet For Specific User
async function getSpecificUsertimeSheetData(req, res) {
  var allTimeSheetDatas = await getAllTimeSheetDatas(req);
  try {
    if (allTimeSheetDatas > 0) {
      res.status(400).json({ data: "No Data found" });
    } else {
      const allTimeSheetData = allTimeSheetDatas.filter(
        (item) => item.userid == req.params.id
      );
      // console.log(allTimeSheetData);
      res.json({
        message: "To Do List send successfull",
        statusCode: 200,
        allTimeSheetData: allTimeSheetData.reverse(),
      });
    }
  } catch (error) {
    res.json({
      message: "Internal server error ",
      statusCode: 500,
    });
  }
}

// To Edit A timeSheetData
async function updateTimeSheetDatas(req, res) {
  try {
    const { id } = req.params;
    const updatedTimeSheetDatas = req.body;
    if (!id || !updatedTimeSheetDatas) {
      return res.status(400).json({ data: "Wrong Request" });
    }
    const result = await updateTimeSheetData(id, updatedTimeSheetDatas);
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
// To Delete A Specific timeSheetData
async function deleteTimeSheetDatas(req, res) {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ data: "Wrong Request" });
    } else {
      const result = await deletetimeSheetData(id);
      console.log(result);
      res.status(200).json({
        data: {
          result: result,
          statusCode: 200,
          message: "Time Sheet Data Deleted Successfully",
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
  generateNewTimeSheetData,
  getAllTimeSheetData,
  getSpecificUsertimeSheetData,
  updateTimeSheetDatas,
  deleteTimeSheetDatas,
};
