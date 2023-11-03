import express from "express";
import {
    generateNewTimeSheetData,
    getAllTimeSheetData,
    getSpecificUsertimeSheetData,
    deleteTimeSheetDatas,
  updateTimeSheetDatas,
} from "../TimeSheet/TimeSheet.js";
//initalize the router
const router = express.Router();
// To add new TimeSheet Data
router.post("/", generateNewTimeSheetData);
// To get all TimeSheet
router.get("/allTimeSheetData", getAllTimeSheetData);
// To get TimeSheet For specific User
router.get("/specificUser/:id", getSpecificUsertimeSheetData);

// To Edit TimeSheet data
router.put("/edit/:id", updateTimeSheetDatas);

// to delete a Specidic TimeSheet data
router.delete("/deleteTimeSheetData/:id", deleteTimeSheetDatas);

export const TimeSheetdataRouter = router;