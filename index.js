const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
var https = require('https')
var http = require('http')
const fs = require('fs')
require('dotenv').config({path: __dirname + '/.env'})

const getip = req => {
	return req.connection.remoteAddress || 
		req.socket.remoteAddress || 
		(req.connection.socket ? req.connection.socket.remoteAddress : null)
}

const gethostname = () =>{
	return `${process.env.NODE_HOSTNAME}:${process.env.NODE_PORT}`
}
const geturl = req => {
	return `${gethostname()}${req.originalUrl}`
}

app = express()
app.use((req,res,next)=>{
	console.log(`[*] Connection from ${getip(req)} to ${geturl(req)}`)
	next()
})

app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
require("./routes")(app)

app.listen(process.env.NODE_PORT)
console.log(`[*] Listening on port:${process.env.NODE_PORT}`)