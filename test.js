const express = require("express")

let app = express()

app.get('*',(req,res,next)=>{
    console.log("request")
    res.sendFile(__dirname +'/' + process.env.TEST_FILE)
})

app.listen(1337,"0.0.0.0")
console.log("listening")