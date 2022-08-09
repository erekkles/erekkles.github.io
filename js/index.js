document.addEventListener("DOMContentLoaded", function(){
    // Firstly, check if the user did visit the login page. In case not, send the user to login page. Go to /js/login.js to check logic. 
    window.localStorage.getItem('isLogged') ? null : window.location.href = window.origin + "/login.html";

    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});