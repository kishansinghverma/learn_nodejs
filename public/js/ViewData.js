tab = {
    dashboard : {
        endpoint : "/dashboard",
        open: ()=>{
            $('#header').html("DASHBOARD");
            $('[aria-expanded]').removeClass('active');
            $('.sub-nav').removeClass('active');
            $('.collapse').collapse('hide');
            $('#dashboard').addClass('active');
        }
    }
}