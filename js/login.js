let form = document.getElementsByTagName('form')[0];
let inputs = document.getElementsByTagName('input');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    for(let i = 0; i < inputs.length; i++) {
        if(inputs[i].value.length === 0) inputs[i].classList.add('is-invalid');
    }

    // When logged in for the first time, 
    if(inputs[0].value.length !== 0 && inputs[1].value.length !== 0) { 
        window.localStorage.setItem('isLogged', true)
        window.location.href = location.origin; 
    }
})