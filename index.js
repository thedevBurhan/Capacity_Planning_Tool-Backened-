import express from "express";
import request from "request";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { isAuthenticated } from "./Authentication/Auth.js";
import { usersRouter } from "./Routers/Routers-User.js";
import { ToDoListdataRouter } from "./Routers/Routers-To-Do-list.js";
import { TimeSheetdataRouter } from "./Routers/Routers-Time-Sheet.js";

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

app.post("/zoom", (req, res) => {
  if (req.query.code) {
    const url =
      "https://zoom.us/oauth/token?grant_type=authorization_code&code=" +
      req.query.code +
      "&redirect_uri=" +
      redirectURL;

    request.post(url, (error, response, body) => {
      if (error) {
        console.error("Error exchanging code for access token:", error);
        return res.status(500).send("Internal Server Error");
      }

      try {
        const tokenResponse = JSON.parse(body);
        console.log(`access_token: ${tokenResponse.access_token}`);
        console.log(`refresh_token: ${tokenResponse.refresh_token}`);

        if (tokenResponse.access_token) {
          const apiUrl = "https://api.zoom.us/v2/users/me";

          request.get(apiUrl, (error, response, body) => {
            if (error) {
              console.error("API Response Error:", error);
              return res.status(500).send("Internal Server Error");
            }

            try {
              const zoomUser = JSON.parse(body);
              console.log("API call ", zoomUser);

              const JSONResponse = `<pre><code>${JSON.stringify(zoomUser, null, 2)}</code></pre>`;

              res.send(`
                <style>
                  /* Your styles here */
                </style>
                <div class="container">
                  <div class="info">
                    <img src="${zoomUser.pic_url}" alt="User photo" />
                    <div>
                      <span>Hello World!</span>
                      <h2>${zoomUser.first_name} ${zoomUser.last_name}</h2>
                      <p>${zoomUser.role_name}, ${zoomUser.company}</p>
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
          }).auth(null, null, true, tokenResponse.access_token);
        } else {
          res.status(500).send("Internal Server Error");
        }
      } catch (parseError) {
        console.error("Error parsing Zoom token response:", parseError);
        res.status(500).send("Internal Server Error");
      }
    }).auth(clientID, clientSecret);
  } else {
    res.redirect(`https://capacity-planning-tool-backend.vercel.app/zoom/authorize`);
  }
});

app.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
