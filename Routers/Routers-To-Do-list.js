import express from "express";
import {
  generateNewToDoListData,
  getAlltoDoListData,
  getSpecificUsertoDoListData,
  getSpecificUserToDoListDataForSpecificCategory,
  deleteToDoListDatas,
  updateToDoListDatas,
} from "../ToDoList/ToDoList.js";
//initalize the router
const router = express.Router();
// To add new ToDoList Data
router.post("/", generateNewToDoListData);
// To get all ToDoList
router.get("/allToDoListData", getAlltoDoListData);
// To get ToDoList For specific User
router.get("/specificUser/:id", getSpecificUsertoDoListData);
// To Get ToDoList For Specific User for Specific Category
router.post(
    "/categoryForSpecificUser/:id/:types",
    getSpecificUserToDoListDataForSpecificCategory
  );
// To Edit ToDoList data
router.put("/edit/:id", updateToDoListDatas);

// to delete a Specidic ToDoList data
router.delete("/deleteToDoListData/:id", deleteToDoListDatas);

export const ToDoListdataRouter = router;