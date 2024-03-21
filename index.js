import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from "socket.io";
import http from "http";
import { isAuthenticated } from './Authentication/Auth.js';
import { usersRouter } from './Routers/Routers-User.js';
import { ToDoListdataRouter } from './Routers/Routers-To-Do-list.js';
import { TimeSheetdataRouter } from './Routers/Routers-Time-Sheet.js';
import { ConversationdataRouter } from "./Routers/Routers-Chat.js";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', usersRouter);
app.use('/toDoListdata', isAuthenticated, ToDoListdataRouter);
app.use('/timeSheet', isAuthenticated, TimeSheetdataRouter);
app.use('/chat', isAuthenticated, ConversationdataRouter);

// socket connection
// Create an HTTP server with the express app
const server = http.createServer(app);

// Create a new instance of Server and pass the server instance
const io = new Server(server, {
    cors: {
        origin: ['*'],
        handlePreflightRequest: (req, res) => {
            res.writeHead(200, {
                "Access-Control-Allow-Headers": "my-custom-header",
                "Access-Control-Allow-Methods": "GET, POST",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            });
            res.end();
        }
    }
});

let users = [];
io.on('connection', socket => {
    console.log('User connected', socket.id);
    socket.on('addUser', userId => {
        const isUserExist = users.find(user => user.userId === userId);
        if (!isUserExist) {
            const user = { userId, socketId: socket.id };
            users.push(user);
            io.emit('getUsers', users);
        }
    });

    socket.on('sendMessage', async ({ senderId, receiverId, messages, conversationId,userid,time }) => {
        const receiver = users.find(user => user.userId === receiverId);
        const sender = users.find(user => user.userId === senderId);
        console.log('sender :>> ', sender, receiver);
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage', {
                senderId,
                messages,
                time,
                conversationId,
                receiverId,
                userid
            });
        });

    socket.on('disconnect', () => {
        users = users.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', users);
    });
    // io.emit('getUsers', socket.userId);
});
    // import request from "request";
    // import bodyParser from "body-parser";
    // import cors from "cors";
    // import dotenv from "dotenv";
    // import { isAuthenticated } from "./Authentication/Auth.js";
    // import { usersRouter } from "./Routers/Routers-User.js";
    // import { ToDoListdataRouter } from "./Routers/Routers-To-Do-list.js";
    // import { TimeSheetdataRouter } from "./Routers/Routers-Time-Sheet.js";
    // import axios from "axios";
    // import { zoomRouter } from "./Routers/Routers-Zoom.js";
    // dotenv.config();

    // const app = express();
    // const PORT = process.env.PORT || 3000;
    // // const clientID = process.env.clientID;
    // // const clientSecret = process.env.clientSecret;
    // // const redirectURL = process.env.redirectURL;

    // app.use(express.json());
    // app.use(cors());
    // app.use(bodyParser.json());
    // app.use(bodyParser.urlencoded({ extended: true }));

    // app.use("/users", usersRouter);
    // app.use("/toDoListdata", isAuthenticated, ToDoListdataRouter);
    // app.use("/timeSheet", isAuthenticated, TimeSheetdataRouter);
    // app.use("/",zoomRouter);

    // // CONSTANTS
    // const ZOOM_GET_AUTHCODE='https://zoom.us/oauth/token?grant_type=authorization_code&code=';
    // const ZOOM_AUTH='https://zoom.us/oauth/authorize?response_type=code&client_id='

    // //Root URL /
    // app.get('/', (req, res) => {
    //   /*
    //       If the code (auth code) property exists in req.query object,
    //       user is redirected from Zoom OAuth. If not, then redirect to Zoom for OAuth
    //   */
    //   const authCode=req.query.code;
    //   if (authCode) {
    //     // Request an access token using the auth code
    //     let url =  ZOOM_GET_AUTHCODE + authCode + '&redirect_uri=' + process.env.redirectURL;
    //     request.post(url, (error, response, body) => {
    //         // Parse response to JSON
    //         body = JSON.parse(body);
    //         const accessToken = body.access_token;
    //         const refreshToken = body.refresh_token;
    //         // Obtained access and refresh tokens
    //         console.log(`Zoom OAuth Access Token: ${accessToken}`);
    //         console.log(`Zoom OAuth Refresh Token: ${refreshToken}`);
    //         if(accessToken)
    //         // Use the obtained access token to authenticate API calls
    //         // Send a request to get your user information using the /me endpoint
    //         // The `/me` context restricts an API call to the user the token belongs to
    //         // This helps make calls to user-specific endpoints instead of storing the userID
    //         request.get('https://api.zoom.us/v2/users/me', (error, response, body) => {
    //             if (error) {
    //                 console.log('API Response Error: ', error)
    //             } else {
    //                 body = JSON.parse(body);
    //                 var JSONResponse = '<pre><code>' + JSON.stringify(body, null, 2) + '</code></pre>'
    //                 res.send(`
    //                     <style>
    //                         @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,600&display=swap');@import url('https://necolas.github.io/normalize.css/8.0.1/normalize.css');html {color: #232333;font-family: 'Open Sans', Helvetica, Arial, sans-serif;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}h2 {font-weight: 700;font-size: 24px;}h4 {font-weight: 600;font-size: 14px;}.container {margin: 24px auto;padding: 16px;max-width: 720px;}.info {display: flex;align-items: center;}.info>div>span, .info>div>p {font-weight: 400;font-size: 13px;color: #747487;line-height: 16px;}.info>div>span::before {content: "👋";}.info>div>h2 {padding: 8px 0 6px;margin: 0;}.info>div>p {padding: 0;margin: 0;}.info>img {background: #747487;height: 96px;width: 96px;border-radius: 31.68px;overflow: hidden;margin: 0 20px 0 0;}.response {margin: 32px 0;display: flex;flex-wrap: wrap;align-items: center;justify-content: space-between;}.response>a {text-decoration: none;color: #2D8CFF;font-size: 14px;}.response>pre {overflow-x: scroll;background: #f6f7f9;padding: 1.2em 1.4em;border-radius: 10.56px;width: 100%;box-sizing: border-box;}
    //                     </style>
    //                     <div class="container">

    //                         <div class="response">
    //                             User API Response
    //                             ${JSONResponse}
    //                         </div>
    //                     </div>
    //                 `);
    //             }
    //         }).auth(null, null, true, body.access_token);
    //     else
    //         res.send('Something went wrong')
    //     }).auth(process.env.clientID, process.env.clientSecret);
    //     return;
    // }
    // // If no auth code is obtained, redirect to Zoom OAuth to do authentication
    // res.redirect(ZOOM_AUTH + process.env.clientID + '&redirect_uri=' + process.env.redirectURL)
    // })





    // app.all("/Meeting/zoom/", async (req, res) => {
    //   try {
    //     if (req.method === "GET" || req.method === "POST") {
    //       const { code } = req.query;

    //       if (!code) {
    //         console.error("Code parameter missing");
    //         return res.status(400).send("Code parameter missing");
    //       }

    //       console.log("clientID:", clientID);
    //       console.log("clientSecret:", clientSecret);
    //       console.log("redirectURL:", redirectURL);
    //       console.log("code:", code);

    //       const url = 'https://zoom.us/oauth/token';
    //       const data = {
    //         grant_type: 'authorization_code',
    //         code: code,
    //         redirect_uri: redirectURL,
    //       };

    //       const base64Credentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
    //       const headers = {
    //         Authorization: `Basic ${base64Credentials}`,
    //       };

    //       const response = await axios.post(url, null, { params: data, headers });
    //       console.log("Token Response:", response.data);

    //       if (response.data && response.data.access_token) {
    //         const apiUrl = "https://api.zoom.us/v2/users/me";

    //         const zoomUser = await axios.get(apiUrl, {
    //           headers: {
    //             Authorization: `Bearer ${response.data.access_token}`,
    //           },
    //         });

    //         const zoomUserData = zoomUser.data;
    //         console.log("API call ", zoomUserData);

    //         res.json(zoomUserData);
    //       } else {
    //         console.error("Invalid token response:", response.data);
    //         res.status(500).send("Invalid token response");
    //       }
    //     } else {
    //       res.status(405).send("Method Not Allowed");
    //     }
    //   } catch (error) {
    //     console.error("Unexpected error:", error);
    //     res.status(500).send("Unexpected error");
    //   }
    // });

    // app.get("/Meeting/zoom/", async (req, res) => {
    //   try {
    //     const { code } = req.query;


    //     if (!code) {
    //       console.error("Code parameter missing");
    //       return res.status(400).send("Code parameter missing");
    //     }
    //     console.log("clientID:", clientID);
    //     console.log("clientSecret:", clientSecret);
    //     console.log("redirectURL:", redirectURL);
    //     console.log("code:", code);
    //       const url = 'https://zoom.us/oauth/token';
    //       const data = {
    //         grant_type: 'authorization_code',
    //         code: code,
    //         redirect_uri: redirectURL,
    //       };

    //       const base64Credentials = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
    //       const headers = {
    //         Authorization: `Basic ${base64Credentials}`,
    //       };

    //       const response = await axios.post(url, null, { params: data, headers });
    //       console.log("Token Response:", response.data);
    //       if (response.data && response.data.access_token) {
    //         const apiUrl = "https://api.zoom.us/v2/users/me";

    //         const zoomUser = await axios.get(apiUrl, {
    //           headers: {
    //             Authorization: `Bearer ${response.data.access_token}`,
    //           },
    //         });

    //         const zoomUserData = zoomUser.data;
    //         console.log("API call ", zoomUserData);

    //         res.json(zoomUserData);
    //       } else {
    //         console.error("Invalid token response:", response.data);
    //         res.status(500).send("Invalid token response");
    //       }
    //     } catch (error) {
    //       console.error("Unexpected error:", error);
    //       res.status(500).send("Unexpected error");
    //     }
    //   });
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

    server.listen(PORT, () => console.log(`Server Running on port ${PORT}`));
