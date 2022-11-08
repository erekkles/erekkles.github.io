initialRender();
authorizeUser();

const inputs = [$('#firstName'), $('#lastName'), $('#surname'), $('#surname2'), $('#number')];
const fileReader = new FileReader();

(function hydrate() {

    const emailInput = $('#email');
    emailInput.value = localStorage.getItem('email');
    const image64 = localStorage.getItem('profile-img');

    inputs.forEach(input => {
        input.value = localStorage.getItem(input.id) ?? '';
    })

    $('#profile_preview').src = image64 ?? './img/img_perfil.png';
    
})();

$('#submit').addEventListener('click', (e) => {
    e.preventDefault();

    const requiredInputs = inputs.filter(input => input.required);

    const imgInput = $('#profile');
    if(requiredInputs.some(input => input.value.length <= 0)) return alert('Rellena los campos obligatorios (*)');

    inputs.forEach(input => {
        localStorage.setItem(input.id, input.value);
    })
    
    if(imgInput.files.length > 0) fileReader.readAsDataURL(imgInput.files[0]);
    
    alert('Datos actualizados satisfactoriamente');
})

fileReader.addEventListener('loadend', () => {
    try {
        localStorage.setItem('profile-img', fileReader.result)
        $('#profile_preview').src = fileReader.result;
    } catch (error) {
        if(error.name === 'QuotaExceededError') return alert('La imagen que intentaste añadir es demasiado grande!')
        console.error(error.name + ": " + error.message)
    }
})