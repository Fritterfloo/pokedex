const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public')); // Serve static files from 'public'

app.post('/identify-pokemon', async (req, res) => {
    const { imageData } = req.body;

    try {
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`
            },
            body: JSON.stringify({
                prompt: "Recognize this Pokémon: " + imageData,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error identifying Pokémon');
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
