const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Endpoint to serve your website
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Endpoint to handle Notion OAuth
app.get('/notion_auth', (req, res) => {
    const authorizationCode = req.query.code;
    // Exchange the authorization code for an access token
    // ... [We will get back to this]
    
    // For now, just send the authorization code back as a response
    res.send(authorizationCode);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

ChatGPT