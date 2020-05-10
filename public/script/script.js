window.onload  = function(){
    var error = document.querySelector(".error");
    setTimeout(function(){
        var errorElement = document.querySelector(".error");
        var successElement = document.querySelector('.success');
        if(errorElement != null){
            errorElement.style.display = "none";
        }
        if(successElement != null){
            successElement.style.display = "none";
        }
        },5000);

}

function show(){
    var show = document.getElementById("navbarNav");
    if(show.style.display == "block"){
        show.style.display = "none";
    }
    else{
        show.style.display = "block";
    }
}


