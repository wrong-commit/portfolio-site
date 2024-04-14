const mongoose = require("mongoose")
const fs = require('fs')
const path = require('path')

module.exports = function(app){

	app.get('/document/:repoName/:repoPath*',(req,res,next)=>{
		const dlName = req.originalUrl.split('/').splice(3).join('/')
		const repoPath = path.join(__dirname,'repo',req.params.repoName)
		const dlPath = path.join(repoPath,dlName)
		// console.log(`user requested ${dlPath}`)
		if(dlPath.substring(0, repoPath.length ) != repoPath){
			console.log("user tried to directory traversal")
			res.sendStatus(404)
			next()
		}else{
			//res.send() returns file contents
			fs.readFile(dlPath, 'utf8',(err,data)=>{
				if(err) {
					console.log(err)
					res.sendStatus(404)
				} else {
					// console.log('sending data')
					res.send(data)
				}
				next()
			})
		}
	})

	app.get('/repo/:tree',(req,res,next)=>{
		if(req.params.tree == 'cryptor'){
			fs.readFile(__dirname + '/repo/cryptor.json', 'utf8',(err,data)=>{
				if(err) {
					console.log(err)
					res.sendStatus(404)
				} else {
					console.log('sending data')
					res.send(data)
				}
				next()
			})
		}else if( req.params.tree == 'proxy'){
			fs.readFile(__dirname + '/repo/proxy.json', 'utf8',(err,data)=>{
				if(err) {
					console.log(err)
					res.sendStatus(404)
				} else {
					console.log('sending data')
					res.send(data)
				}
				next()
			})
		}else if( req.params.tree == 'auspost'){
			fs.readFile(__dirname + '/repo/auspost.json', 'utf8',(err,data)=>{
				if(err) {
					console.log(err)
					res.sendStatus(404)
				} else {
					console.log('sending data')
					res.send(data)
				}
				next()
			})
		}
	})
	
	app.get('/',(req,res,next)=>{
		//TODO: return array of box objects from db
		res.render('pages/main.ejs',
		{
			title: "quinn's portfolio | its super cool",
			colors: [ "#f18c0a", 
								"#000000", 
								"#020202", 
								"#020202",
								"#f18c0a",
								"#000000" ]
		})
		next()
	})
}