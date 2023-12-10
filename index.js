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

app.get("/zoom/", async (req, res) => {
  try {
    const code = req.body.code;

    if (!code) {
      return res.status(400).send("Code parameter missing");
    }

    const url =
      "https://zoom.us/oauth/token?grant_type=authorization_code&code=" +
      code +
      "&redirect_uri=" +
      redirectURL;

    const tokenResponse = await axios.post(url, null, {
      auth: {
        username: clientID,
        password: clientSecret,
      },
    });

    if (tokenResponse.data.access_token) {
      const apiUrl = "https://api.zoom.us/v2/users/me";

      const zoomUser = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
        },
      });

      try {
        const zoomUserData = zoomUser.data;
        console.log("API call ", zoomUserData);

        const JSONResponse = `<pre><code>${JSON.stringify(zoomUserData, null, 2)}</code></pre>`;

        res.send(`
          <style>
            /* Your styles here */
          </style>
          <div class="container">
            <div class="info">
              <img src="${zoomUserData.pic_url}" alt="User photo" />
              <div>
                <span>Hello World!</span>
                <h2>${zoomUserData.first_name} ${zoomUserData.last_name}</h2>
                <p>${zoomUserData.role_name}, ${zoomUserData.company}</p>
              </div>
            </div>
            <div class="response">
              <h4>JSON Response:</h4>
              <a href="https://marketplace.zoom.us/docs/api-reference/zoom-api/users/user" target="_blank">
                API Reference
              </a>
              ${JSONResponse}
            </div>
          </div>
        `);
      } catch (parseError) {
        console.error("Error parsing Zoom API response:", parseError);
        res.status(500).send("Internal Server Error");
      }
    } else {
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).send("Internal Server Error");
  }
});
app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
