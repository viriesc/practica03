'use strict'
localStorage.token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoiNzMyNzU3IiwiaWF0IjoxNTg1NTU2MjU5fQ.kV2bU9Rrmt8ci3C1776zgdlBL1FJ6pa5syxpdmYw6IU"

/*Registro usuarios, validacion del formulario */

//registramos los cambios en el formulario
    let registro = document.getElementById("registro");
    registro.addEventListener('change', cambioReg);
    registro.addEventListener('submit', altaUser);


//Listener del login
    let loginBtn = document.getElementById('login');
login.addEventListener('click', Accesar);
// Atrapa elementos invalidos

let invalid = document.querySelectorAll("#registro:invalid");
invalid.forEach(obj => {obj.style = "border-color: red"});

//elementos validos
let valid = document.querySelectorAll("#registro :valid");
valid.forEach(valid => {
    valid.style = "border-color: none";
});

//desactivacion del boton
let btnSub = document.querySelector('[type=submit]');
btnSub.setAttribute('disabled','');

function cambioReg(event) {
    invalid = document.querySelectorAll("#registro :invalid");
    invalid.forEach(obj => {
        obj.style = "border-color: red";
    });
    
    if ((invalid.length != 0)) {
       //;
       btnSub.setAttribute('disabled','');
        valid.style = "border-color: none";
    }else if(document.getElementById('pw').value != document.getElementById('cpw').value) {
        submitReg.setAttribute('disabled', '');
        document.getElementById('cwp').style = "border-color: red";
    } else {
        btnSub.removeAttribute('disabled')
        valid.style = "border-color: none";
    }
     
}

/*Registro LOGIN*/

//Obtener datos desde submit
function altaUser(event) {
    event.preventDefault();
    let GenerarHeader = {
        'x-auth': localStorage.token,
        'Content-Type': 'application/json'
    };
    let user = {
        nombre: document.getElementById('firstName').value,
        apellido: document.getElementById('lastName').value,
        correo: document.getElementById('email').value,
        url: document.getElementById('url').value,
        sexo: document.querySelector('[name=sexo]:checked').value,
        fecha: document.getElementById('date').value,
        password: document.getElementById('pw').value
    }
    
     console.log(typeof(user.fecha)); 
    makeHTTPRequest('/api/users', 'POST', GenerarHeader, user);
}

function Accesar(event) {
    let GenerarHeaders = {
        'x-auth': localStorage.token,
        'Content-Type': 'application/json'
    };
    let user = {
        correo: document.getElementById('emailLogin').value,
        password: document.getElementById('pwLogin').value
    }
    makeHTTPRequest('/api/login', 'POST', GenerarHeader, user);
}


const baseURl = 'https://users-dasw.herokuapp.com';


function makeHTTPRequest(endpoint, method, headers, data){
    // objeto xhr
    let xhr = new XMLHttpRequest();
    // config
    xhr.open(method, baseURl+endpoint);

    //settings
    for(let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
    }
    // Enviar solicitud
    xhr.send(JSON.stringify(data));
    //Respuesta 
    xhr.onload = () => {
       
        switch(xhr.status) {
            case 200:
                 alert('ya ingreso');
                window.location.href = '.\consulta.html';
            break;
            case 201:
                alert('Registro exitoso.');

            break;
            default: 
                alert('Error del Tipo: ' + xhr.status);
        }
        console.log(xhr.response);
    }
}