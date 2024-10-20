const { json } = require("body-parser");

document.querySelector("#Photo").addEventListener('submit',async(e)=>{
    e.preventDefault();
    const idno = document.querySelector('#idno').value
    const name = document.querySelector('#name').value
    const photo = document.querySelector('#photo').files[0]

    const response = await fetch('/data',{
        method:"POST",
        body:JSON.stringify({idno , name , photo})
    })

    const result = await response.json()
    console.log(result)
})