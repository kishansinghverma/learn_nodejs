var messages={
    error:"<i style='color: #db3000' class=\"fa fa-times-circle-o fa-lg\" aria-hidden=\"true\"></i> Can't Save The Entry! ",
    success:"<i style='color: #4cae4c' class=\"fa fa-check-circle-o fa-lg\" aria-hidden=\"true\"></i> Entry Saved Successfully! "
}
var thisPage='cold_kharid';

$(document).ready(function() {
    setModalProperties();
    followPreSetInstruction();
});
function followPreSetInstruction(){
    let preSetData
    try{
        preSetData=JSON.parse($('#inner-page')[0].innerHTML);
        $('#inner-page')[0].innerHTML='';

        if(preSetData.page===thisPage) {
            if (jQuery.isEmptyObject(preSetData.data)) {
                $('#info-model-message').html(messages.error);
                $('#info-modal-action-button')[0].style.display = 'none';
            } else {
                $('#info-modal-action-button').html('View Entry');
                $('#info-model-message').html(messages.success);
                $('#info-modal-action-button')[0].style.display = 'inline';
            }
            $('#info-modal-header').html('Saving Data...');
            $('#alertModal').modal('show');
        }
    }catch (e){console.error('PreSet Data Not Available! '+e);}
}
function setModalProperties(){
    $("#myModal").on('show.bs.modal', function () {
        document.getElementById("new-cold-form").reset();
        document.getElementById("add-cold-btn").innerHTML="Save";
        document.getElementById("new-cold-error").innerHTML="";
    });
    $("#myModal").on('hidden.bs.modal', function () {
        document.getElementById("cold-name-list").selectedIndex=0;
    });
}
function showColdStoreInsertModal(option){
    if(option.value==='add')
        $("#myModal").modal('show');
}
function saveColdStoreData(){
    document.getElementById('add-cold-btn').innerHTML=
        "<span class=\"spinner-border spinner-border-sm\"></span>&nbsp; Saving...";

    $.ajax('/db/new_cold', {
        type: 'POST',
        data: {
            name: $('#cold-name').val(),
            bag: $('#bag').val(),
            due: $('#due').val()
        },
        success: function (data, status, xhr) {
            if(jQuery.isEmptyObject(data)){
                document.getElementById("add-cold-btn").innerHTML="Save";
                document.getElementById("new-cold-error").innerHTML="Error! New Cold Details Not Saved."
            }
            else {
                let nameList=document.getElementById('cold-name-list');
                let options="<option disabled selected>Select Cold Storage Name</option>";
                for(let x of data){
                    options+="<option value="+x.name+">"+x.name+"</option>";
                }
                options+="<option value=\"add\">Add New Cold Store</option>";
                nameList.innerHTML=options;
                $("#myModal").modal('hide');
            }
        },
        error: function (jqXhr, textStatus, errorMessage) {
            window.alert("Network Issue: Save New Cold Details!\n"+errorMessage);
            location.reload();
        }
    });
    return false;
}
function validateDropDown(input){
    if(input.selectedIndex==0 || input.selectedIndex==-1)
        input.setCustomValidity('Please Select A Valid Option!');
    else
        input.setCustomValidity('');
}
function applyValidation(){
    let coldList=document.getElementById("cold-name-list");
    let pType=document.getElementById("type");
    let tol=document.getElementById("tol");
    let filePicker=document.getElementById("customFile");

    validateDropDown(coldList);
    validateDropDown(pType);
    validateDropDown(tol);

    if(filePicker.files.length>5)
        filePicker.setCustomValidity('Maximum 5 Files Allowed!');
    else
        filePicker.setCustomValidity('');
}
function setFileInputText(){
    let label=document.getElementById("fileLabel");
    let fileInput=document.getElementById("customFile");
    if(fileInput.files.length>0){
        label.innerHTML=fileInput.files.length+' Files Selected';
    }else {
        label.innerHTML='Choose Files (Max 5 Files)';
    }
}
function generateFieldData(sellerName){

    let mobileDataList=document.getElementById('seller-mobile');
    let sellerID=document.getElementById('seller-id');
    let nameDataList=document.getElementById('seller-name');
    let option=nameDataList.options.namedItem(sellerName.value);
    let options="";

    if(option){
        let data = JSON.parse(option.id);
        sellerID.value=data.id;
        for(let number of data.contact)
            options+="<option value="+number+">";
    }else
        sellerID.value='';
    mobileDataList.innerHTML=options;
}
function getBuyerMobile(){
    let dataList=document.getElementById('buyer-mobile');
    let options="";
    if($('#buyer-name-input').val()==='Nem Singh'){
        options+="<option value='9719814140'>";
    }
    else if($('#buyer-name-input').val()==='Mahesh Chand'){
        options+="<option value='9675234150'><option value='9675444150'>";
    }
    dataList.innerHTML=options;
}