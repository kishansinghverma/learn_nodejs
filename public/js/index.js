$(document).ready(function(){
    let innerPageData;
    try {
        innerPageData = JSON.parse($('#inner-page')[0].innerHTML);
        functions[innerPageData.page]();
    }catch (e){console.log(e)}
});
let header={
    /*dashboard:'dashboard',*/
    cold_kharid:'cold kharid form',
    kisan_kharid:'kisan kharid form',
    self_entry:'self entry form',
    display_cold_kharid:'view cold kharid',
    display_kisan_kharid:'view kisan kharid',
    display_self_entry:'view self entry'
}
let functions={
    dashboard: ()=>{loadDashboard();},
    cold_kharid: ()=>{
        let tabData=getTabData('cold_kharid');
        loadChild(tabData.element);
        doGet(tabData.innerLink);
    },
    display_cold_kharid: ()=>{
        let tabData=getTabData('display_cold_kharid')

    }
}

function getTabData(tabName){
    return {
        header:header[tabName],
        innerLink: '/'+tabName,
        JSLink: '/js/'+tabName+'.js',
        element: $('[href="#'+tabName+'"]')[0]
    }
}

function doGet(link){
    $.ajax({
        url: link,
        success: function( result ) {
            $('#target').html(result);
            loadScript();
        }
    });
}
function doPost(tab, data){

}
function toggleLinksDisplay(tab){
    let id=tab.href.split("#")[1];
    $('.collapse').collapse('hide');
    $('#'+id).collapse('show');
}
function activateChild(child){
    $('.sub-nav').removeClass('active');
    $(child).addClass('active');
}
function activateTab(){
    $('[aria-expanded=false]').removeClass('active');
    $('[aria-expanded=true]').addClass('active');
}

function loadChild(child){
    activateChild(child);
    activateTab();
    let childName=child.href.split('#')[1];
    let tabData=getTabData(childName);
    loadHelpers(tabData);
    doGet(tabData.innerLink);
}
function loadPage(page){

    doGet(tabData.innerLink);
}

if ( window.history.replaceState ) {
    window.history.replaceState( null, null, window.location.href );
}
