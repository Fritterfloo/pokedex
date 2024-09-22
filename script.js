const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const video = document.getElementById('video');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvas');

// Start video stream
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => console.error("Error accessing webcam: ", err));

// Search Pokémon
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    // Perform search (dummy implementation)
    resultsDiv.innerHTML = `You searched for: ${query}`;
});

// Capture Pokémon Image
captureButton.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const capturedImage = canvas.toDataURL('image/png');  // Base64 image
    identifyPokemonUsingOpenAI(capturedImage);  // Call OpenAI API to identify Pokémon
});

// Call OpenAI API
async function identifyPokemonUsingOpenAI(imageData) {
    const apiKey = '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';  // Fake API key
    const url = 'https://api.openai.com/v1/images/generations';  // Example endpoint

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                prompt: "Recognize this Pokémon: " + imageData,
                n: 1,
                size: "1024x1024"
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Pokémon Identified: ", data);
            alert("Pokémon Identified: " + data.choices[0].text);  // Adjust based on actual API response
        } else {
            console.error("Error:", data.error);
            alert("Error identifying Pokémon.");
        }
    } catch (error) {
        console.error('Error with API request:', error);
    }
}
