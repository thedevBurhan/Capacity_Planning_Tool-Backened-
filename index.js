import express from "express";
import request from "request";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { isAuthenticated } from "./Authentication/Auth.js";
import { usersRouter } from "./Routers/Routers-User.js";
import { ToDoListdataRouter } from "./Routers/Routers-To-Do-list.js";
import { TimeSheetdataRouter } from "./Routers/Routers-Time-Sheet.js";
import axios from "axios";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const clientID = process.env.clientID;
const clientSecret = process.env.clientSecret;
const redirectURL = process.env.redirectURL;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", usersRouter);
app.use("/toDoListdata", isAuthenticated, ToDoListdataRouter);
app.use("/timeSheet", isAuthenticated, TimeSheetdataRouter);

app.get("/Meeting/zoom/", async (req, res) => {
  try {
    const { code } = req.query;

   
    if (!code) {
      console.error("Code parameter missing");
      return res.status(400).send("Code parameter missing");
    }
    console.log("clientID:", clientID);
    console.log("clientSecret:", clientSecret);
    console.log("redirectURL:", redirectURL);
    console.log("code:", code);
      const url = 'https://zoom.us/oauth/token';
      const data = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectURL,
      };
  
      const base64Credentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
      const headers = {
        Authorization: `Basic ${base64Credentials}`,
      };
  
      const response = await axios.post(url, null, { params: data, headers });
      console.log("Token Response:", response.data);
      if (response.data && response.data.access_token) {
        const apiUrl = "https://api.zoom.us/v2/users/me";
  
        const zoomUser = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        });
  
        const zoomUserData = zoomUser.data;
        console.log("API call ", zoomUserData);
  
        res.json(zoomUserData);
      } else {
        console.error("Invalid token response:", response.data);
        res.status(500).send("Invalid token response");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      res.status(500).send("Unexpected error");
    }
  });
//      if (response.data && response.data.access_token) {
//       const apiUrl = "https://api.zoom.us/v2/users/me";

//       const zoomUser = await axios.get(apiUrl, {
//         headers: {
//           Authorization: `Bearer ${response.data.access_token}`,
//         },
//       });

//       const zoomUserData = zoomUser.data;
//       console.log("API call ", zoomUserData);

//       res.json(zoomUserData);
//     } else {
//       console.error("Invalid token response:", response.data);
//       res.status(500).send("Invalid token response");
//     }
//   } catch (error) {
//     console.error("Unexpected error:", error);
//     res.status(500).send("Unexpected error");
//   }
// });

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
