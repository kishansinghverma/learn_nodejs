$(document).ready(function() {
    $("#myModal").on('show.bs.modal', function () {
        document.getElementById("new-cold-form").reset();
        document.getElementById("add-cold-btn").innerHTML="Save";
        document.getElementById("new-cold-error").innerHTML="";
    });

    $("#myModal").on('hidden.bs.modal', function () {
        document.getElementById("cold-name-list").selectedIndex=0;
    });
});

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

function getSellerMobile(){
    let dataList=document.getElementById('seller-mobile');
    let options="";

    let sellerName=$('#seller-name-input').val();
    $.ajax('/db/seller_mobile', {
        type: 'POST',
        data: {
            name: sellerName
        },
        success: function (data, status, xhr) {
            if(!jQuery.isEmptyObject(data))
                for(let x of data.contact)
                    options+="<option value="+x+">";

            dataList.innerHTML=options;
        },
        error: function (jqXhr, textStatus, errorMessage) {
            window.alert("Network Issue: Seller Contact Details!\n"+errorMessage);
        }
    });
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