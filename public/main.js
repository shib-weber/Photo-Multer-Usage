document.querySelector('#srch').addEventListener('click', async (e) => {
    e.preventDefault();

    const idno = document.querySelector('#search').value;
    const photoContainer = document.querySelector('#photoContainer');
    const photoElement = document.querySelector('#photo');
    const errorMessage = document.querySelector('#errorMessage');

    // Clear previous results
    photoElement.src = '';
    photoElement.style.display = 'none';
    errorMessage.style.display = 'none';

    const response = await fetch(`/photo/${idno}`, {
        method: "GET"
    });

    if (response.ok) {
        // Assuming the server returns a URL or path to the photo
        const photoURL = response.url; // This may need to be adjusted based on your server response

        console.log(photoURL)
        
        // Set the src of the img element and display it
        photoElement.src = photoURL; // Or response.data if your server returns the image data directly
        photoElement.style.display = 'block';
    } else {
        // Show error message
        errorMessage.textContent = 'Photo not found';
        errorMessage.style.display = 'block';
    }
});
