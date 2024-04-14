<script>

function init(){
    downloadRepo("cryptor","cryptor_repo","cryptor_document");
    downloadRepo("proxy","proxy_repo","proxy_document");
    downloadRepo("auspost","auspost_repo","auspost_document");
    // var navButtons = ['about','projects','contact'];
    // var navButtons = [];
    // for(var i=0; i<navButtons.length; i++){
    //     document.getElementById(navButtons[i]+'-button').onclick = function(){
    //         var target = this.getAttribute('target');
    //         scrollTo( document.getElementById(target) );
    //     };
    // }
}

function scrollTo(e){
    console.log(parent);
    console.log(e);
    window.scroll({
        behavior: 'smooth',
        left: 0,
        top: e.offsetTop - 10
    });
}

/* shrinks repo based off the repo='' attribute */
function toggleRepo(e){
    var repo = e.getAttribute('repo');
    var par = document.getElementById(repo).parentElement;
    if(par.getAttribute('clicked')){
        console.log('biggned');
        e.innerHTML = 'expanding..';
        par.removeAttribute('clicked'); //update text of button
        par.style.height = '40em';
        setTimeout(function(){
            scrollTo(e);
            e.innerHTML = 'click to shrink';
        },500);
    }else{
        par.setAttribute('clicked','yes');
        e.innerHTML = 'shrinking...';
        console.log('shrunk');
        par.style.height = '7em';
        setTimeout(function(){
            scrollTo(e);
            e.innerHTML = 'click to expand';            
        },500);
    }
}

function downloadRepo(repoName,id,displayBoxID) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        console.log("Downloading repo " + repoName);
        var root = JSON.parse(xhr.response).root;
        var repo = document.getElementById(id);
        console.log('dlRepo - displayBoxID:'+displayBoxID);
        buildDir(root,repo,displayBoxID,repoName);
    }
    xhr.open('GET', '/repo/'+repoName, true);
    xhr.send();
}

function displayDocument(repo,dir,item,target){
    var xhr = new XMLHttpRequest();
    xhr.onload = function(){
        console.log('target:' +target);
        document.getElementById(target).innerHTML = xhr.response;
    }
    xhr.open('GET', '/document/'+repo+dir+item, true);
    xhr.send();
}

function buildDir(tree,parent,displayBoxID,repoName){
    console.log('id:'+displayBoxID);
    for(var i=0; i < tree.length; i++){
        var msg='[*] Created node ';
        var item;
        var node = tree[i];
        if( node.type == "file" ){
            msg+= 'type:name';
            item = document.createElement('li');
            item.innerHTML = node.name;
            item.classList.add('doc_test');
            item.classList.add('text');
            item.setAttribute('repo',repoName);
            console.log('repo:'+repoName);
            item.setAttribute('path',node.parent);
            item.setAttribute('name',node.name);
            item.addEventListener( 'click',function(e){
                if( this==e.target ){
                    var chosen = document.getElementById('chosenone');
                    if( chosen != null){
                        chosen.removeAttribute('id');
                    }
                    this.setAttribute('id','chosenone');
                    displayDocument(this.getAttribute('repo'), this.getAttribute('path'), this.getAttribute('name'), displayBoxID);
                }
            } );
            //download and display readme by default
            if(node.name == 'README.md'){
                item.setAttribute('id','chosenone');
                displayDocument(item.getAttribute('repo'), item.getAttribute('path'), item.getAttribute('name'), displayBoxID);
            }
        }
        if( node.type == "dir" ){
            msg+= 'type:directory';
            item = document.createElement('ul');
            item.classList.add('dir_closed');
            var child = document.createElement('span');
            child.innerHTML = node.name;
            child.classList.add('text');
            child.addEventListener( 'click',function(e){
                if( this==e.target ){
                    if( this.parentElement.classList.contains('dir_closed') ){
                        this.parentElement.classList.remove('dir_closed');
                        this.parentElement.classList.add('dir_open');
                    }else{
                        this.parentElement.classList.remove('dir_open');
                        this.parentElement.classList.add('dir_closed');
                    }
                }
            } );
            item.appendChild(child);
            buildDir(node.children,item,displayBoxID,repoName);
        }
        console.log(msg);
        parent.appendChild(item);
    }
}

</script>