const fs = require("fs")
const path = require("path")
const listContent = require("list-github-dir-content")

const template = {
  path:"",
  name:"",
  type:"",
  children:[]
}

const TOKEN = '1216720be48baf4e2172dcfc4552b08c2468d6cb'
listContent.viaContentsApi('quinn-samuel-perry/cryptor-and-loader', 'src', TOKEN)
.then(files=>{
  console.log(files)
})
.catch(err=>{
  console.log(err)
})