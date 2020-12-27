tab = {
    dashboard : {
        endpoint : "/dashboard",
        open: ()=>{
            unloadScript(script);
            setScript("/js/dashboard.js");

            $('#header').html("DASHBOARD");
            $('[aria-expanded]').removeClass('active');
            $('.sub-nav').removeClass('active');
            $('.collapse').collapse('hide');
            $('#dashboard').addClass('active');
        }
    }
}

let script=undefined;
function setScript(url){
    if(url==undefined) {
        script=undefined;
    }else {
        script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
    }
}

function loadScript(){
    if(script!=undefined)
        document.getElementsByTagName("body")[0].appendChild(script);
}
function unloadScript(){
    if(script!=undefined)
        document.getElementsByTagName("body")[0].removeChild(script);
}