// Function to show the image overlay
function showImageOverlay(imageUrl, data) {
    // Create a div element for the overlay
    var overlay = document.createElement('div');
    overlay.classList.add('image-overlay');
    // url
    overlay.style.backgroundImage = `url('${imageUrl}')`;
    //styling
    overlay.style.position = "fixed";
    overlay.style.width = "-moz-available";
    overlay.style.backgroundRepeat = "no-repeat";
    //overlay.style.backgroundSize = "contain";
    overlay.style.paddingTop = "66.64%";
    overlay.style.left = "50%";
    overlay.style.transform = "translate(-50%, 0%)";
    overlay.style.zIndex = "2";

    //create back-overlay
    var backoverlay = document.createElement('div')
    backoverlay.classList.add("back-overlay")
    backoverlay.style.position   = "fixed";
    backoverlay.style.width      = "100%";
    backoverlay.style.height     = "100%";
    backoverlay.style.background = "#000";
    backoverlay.style.opacity    = "0.6";
    backoverlay.style.zIndex    = "1";

    // create text bubble
    for (var i = 0 ; i < data.image.texts.length ; i++) {
        createBubble(overlay, data.image.texts[i], data.image.coordinates[i]);
    }

    // Append the overlay to the body
    document.body.appendChild(backoverlay);
    document.body.appendChild(overlay);

    // Add click and mousemove event listeners to the overlay
    backoverlay.addEventListener('click', () => {
        console.log("click")
        document.body.removeChild(overlay);
        document.body.removeChild(backoverlay);
    });
}

// Function to create the text bubble
function createBubble(overlay, text, coordinates) {
    var bubble = document.createElement('div');
    bubble.textContent = text
    bubble.style.border = "solid"
    bubble.style.color = "black"
    bubble.style.backgroundColor = "white"
    bubble.style.writingMode = "vertical-rl";
    bubble.style.textOrientation = "upright";
    bubble.style.fontSize = "22px";
    bubble.style.padding = "3px";
    bubble.style.position = "fixed";
    bubble.style.left = coordinates[0] + 'px'
    bubble.style.top = coordinates[1] + 'px'
    bubble.style.right = coordinates[2] + 'px'
    bubble.style.bottom = coordinates[3] + 'px'
    bubble.style.width = (coordinates[2] - coordinates[0]) + 'px'
    bubble.style.height = (coordinates[3] - coordinates[1]) + 'px'
    overlay.appendChild(bubble)
}

// Function to send a POST request with the image to a specified URL
function sendImage(imageFile) {
    var formData = new FormData();
    formData.append('image', imageFile);

    fetch('https://manga2text-gibgm7jlxq-uc.a.run.app/', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log("POST request sent successfully");
            // Handle the response from the server
            return response.json();
        } else {
            console.error("POST request failed");
        }
    })
    .then(data => {
        console.log("Response from server:", data);
        // Show the image overlay
        var imgURL = URL.createObjectURL(imageFile);
        showImageOverlay(imgURL, data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Function to handle image click event
function imageProcess(imageURL) {
    console.log("image url : ", imageURL) 
    // Fetch the image
    fetch(imageURL)
    .then(response => response.blob()) // Convert response to blob
    .then(blob => {
        // Send a POST request with the image
        sendImage(blob);
    })
    .catch(error => {
        console.error("Error fetching image:", error);
    });
}


// connect port to background
browser.runtime.onMessage.addListener((message) => {
    imageProcess(message.srcUrl)
})
