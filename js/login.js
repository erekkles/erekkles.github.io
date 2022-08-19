let form = document.getElementsByTagName('form')[0];
let inputs = document.getElementsByTagName('input');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    if(window.localStorage.getItem('isLogged')) return;
    
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i].value.length === 0) inputs[i].classList.add('is-invalid');
    }

    // When logged in for the first time, 
    if(inputs[0].value.length !== 0 && inputs[1].value.length !== 0) { 
        window.localStorage.setItem('isLogged', true);
        window.localStorage.setItem('name', inputs[0].value);
        window.location.href = location.origin; 
    }
})

// This function parses de JWT token given by Google Auth
function parseJwt (token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function onSignIn(googleUser) {
    const username = parseJwt(googleUser.credential).name;
    window.localStorage.setItem('isLogged', true);
    window.localStorage.setItem('name', username);
    window.location.href = location.origin;
}