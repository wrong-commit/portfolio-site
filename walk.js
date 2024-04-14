const fs = require("fs")
const path = require("path")
// const listContent = require("list-github-dir-content")

const template = {
  parent:"",  // Examples "/", "/views/pages/" 
  name:"",    // "file.pdf", "dir_name"
  type:"",    // "file", "dir"
  children: undefined // undefined for type "file"
}

const SEPARATOR = path.sep;

async function ls(path, parent) {
  const root = {...template}
  root.name = path.split(SEPARATOR, -1)
  root.parent = parent ?? SEPARATOR
  root.type = 'dir'
  root.children = [];
  const dir = await fs.promises.opendir(path)
  for await (const dirent of dir) {
    const t = {...template};

    const p = `${dirent.path}${SEPARATOR}${dirent.name}`
    // Stat the file to see if we have a file or dir
    const stat = await fs.promises.stat( p );

    if( stat.isFile() ){
      console.log( "'%s' is a file.", dirent.name );
      t.type = 'file';
    } else if( stat.isDirectory()){
        console.log( "'%s' is a directory.", dirent.name );
        t.type = 'dir'   
        t.children = (await ls(p)).children;
    }
    t.name = dirent.name;
    t.parent = dirent.path + SEPARATOR;
    // console.log(JSON.stringify(t))

    root.children.push(t);
  }
  return root;
}

async function cleanup(files, rootPath) { 

  if(files.type === 'dir') { 
    await Promise.all(files.children.map(x => cleanup(x, rootPath)))
  }
  const newPath = files.parent.replace(rootPath, ''); 
  console.log(`Changed ${files.name} to path [${rootPath}] to [${newPath}]`)
  files.parent = SEPARATOR + newPath ;
} 

function sort(files) { 
  if(files.type === 'dir' ) { 
    files.children.map(x=>sort(x))
    files.children.sort((a,b) => a.name.localeCompare(b.name))
    // sort directories above files
    files.children.sort((a,b) => a.type.localeCompare(b.type))
  }
}

// Look up folders in /repo/ and then output JSON at /repo/.json
const main = async (repoName) => { 
  const DIR = `repo${SEPARATOR}${repoName}`
  // Our starting point
  try {
    // Get the files as an array
    const files = await ls(__dirname + SEPARATOR + DIR);
    // remove absolute path name
    await cleanup(files, __dirname + SEPARATOR )
    // remove /repo/ from JSON path
    await cleanup(files, `${SEPARATOR}repo${SEPARATOR}${repoName}${SEPARATOR}` )
    files.name = repoName;
    files.parent = SEPARATOR; 

    // sort files alphabetically
    sort(files)

    const outputFileName = __dirname + SEPARATOR + 'repo' + SEPARATOR +repoName+ '.json'
    const outputJson = JSON.stringify({root:files.children}, undefined, 2)

    if(SEPARATOR == '\\') { 
      //outputJson.replace(SEPARATOR, '/')
    }

    console.log(outputJson)
    fs.writeFileSync(
      outputFileName, 
      outputJson);


  }
  catch( e ) {
    // Catch anything bad that happens
    console.error( "We've thrown! Whoops!", e );
  }
}

// git clone repositories to /repo/, rename and run this script
main('proxy')
main('cryptor')
main('auspost')