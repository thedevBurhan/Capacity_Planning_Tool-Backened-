import axios from "axios";
import express from "express";
//initalize the router
const router=express.Router();

router.post('/api/zoom/auth', async (req, res) => {
    const { code } = req.body;

    try {
      // Exchange Zoom authorization code for an access token
      const response = await axios.post('https://zoom.us/oauth/token', {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.redirectURL,
        client_id: process.env.clientID,
        client_secret: process.env.clientSecret,
      });
  
      const accessToken = response.data.access_token;
  
      // Use the access token to make requests to Zoom API
      const userDataResponse = await axios.get('https://api.zoom.us/v2/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const userData = userDataResponse.data;
      // Handle the user data as needed
  
      res.json(userData);
    } catch (error) {
      console.error('Error handling Zoom callback:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  export const zoomRouter=router;  