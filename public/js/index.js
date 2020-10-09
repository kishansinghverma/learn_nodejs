let dashboard=document.getElementById('dashboard');
let entryForm=document.getElementById('entry-form');
let routine=document.getElementById('routine');
let management=document.getElementById('management');
let report=document.getElementById('report');
let script=undefined;

function activateTab(tab){
    var tabs=[dashboard, entryForm, routine, management, report];
    for (var x of tabs){
        if(x===tab)
            x.className='active';
        else
            x.className=null;
    }
}
function toggleLinksDisplay(tab, className){
    if(tab.getAttribute('status')==='collapsed'){
        for(var x of document.getElementsByClassName(className))
            x.style.display='block';
        tab.setAttribute('status', 'expanded');
        tab.innerHTML=tab.innerHTML.replace('down', 'up');
    }
    else {
        for(var x of document.getElementsByClassName(className))
            x.style.display='none';
        tab.setAttribute('status', 'collapsed');
        tab.innerHTML=tab.innerHTML.replace('up', 'down');
    }
}

function setScript(url){
    if(url==undefined) {
        script=undefined;
    }else {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
    }
}
function getScript(){
    return script;
}
function loadScript(script){
    if(script!=undefined)
        document.getElementsByTagName("body")[0].appendChild(script);
}
function unloadScript(script){
    if(script!=undefined)
        document.getElementsByTagName("body")[0].removeChild(script);
}

function loadContent(innerLink, JSLink, headerText){
    unloadScript(getScript());
    setScript(JSLink);

    document.getElementById('header').innerHTML=headerText;
    $.ajax({
        url: innerLink,
        success: function( result ) {
            document.getElementById('target').innerHTML=result;
            loadScript(getScript());
        }
    });
}
function loadTab(tab){
    if(tab===dashboard){
        loadContent("/dashboard", undefined, 'DASHBOARD');
    }
    else if(tab===entryForm){
        toggleLinksDisplay(tab, 'sub-form-nav');
        return;
    }
    activateTab(tab);
}
function loadForm(form){
    let formName=form.replace("_", " ").toUpperCase();
    loadContent('/'+form, './js/'+form+'.js', 'ENTRY FORM / '+formName);
    toggleLinksDisplay(entryForm, 'sub-form-nav');
    activateTab(entryForm);
}

function initLoad(){
    loadTab(dashboard);
}
