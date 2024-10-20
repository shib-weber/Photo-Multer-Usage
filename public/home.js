document.querySelector("#p-form").addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('submitting')

    const idno = document.querySelector('#idno').value;
    const name = document.querySelector('#name').value;
    const photo = document.querySelector('#photo').files[0];

    const formData = new FormData(); // Create a new FormData object
    //formData.append('idno', idno);
    //formData.append('name', name);
    formData.append('photo', photo); // Append the file

    const response = await fetch('/data', {
        method: "POST",
        body: formData, // Use formData instead of JSON.stringify
        headers: {
            // Do not set 'Content-Type'. The browser automatically sets it to 'multipart/form-data' with the correct boundary.
        }
    });

    const result = await response.json();
    console.log('result',result);
    const fille = result.fileId

    const response2 = await fetch('/save',{
        method:"POST",
        headers:{},
        body:JSON.stringify({idno,name, photo:fille})
    })

    const result2 = await response2.json()
});
