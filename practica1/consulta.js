'use strict'

document.body.onload = adminUsuarios;
localStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoiNzMyNzU3IiwiaWF0IjoxNTg1NTU2MjU5fQ.kV2bU9Rrmt8ci3C1776zgdlBL1FJ6pa5syxpdmYw6IU";
let correo = '';
document.getElementById('submitEdit').onclick = submitEdit;
document.getElementById('submitDelete').onclick = submitDelete;
let userList = [];

function adminUsuarios(event) {

    let headers = {
        'x-auth': localStorage.token,
        'x-user-token': localStorage.token
    };
    makeHTTPRequestUsuarios('/api/users', 'GET', headers, '', cbUsuarios);
}

function cbUsuarios(xhr) {
    switch(xhr.status) {
        case 200:
            let usuarios = JSON.parse(xhr.response);
            usuarios.forEach(element => {
                let email = element.correo;
                makeHTTPRequestUsuarios(`/api/users/${email}`, 'GET',
                                        {'x-auth': localStorage.token, 'x-user-token': localStorage.token},
                                        '', cbDetalleUsuario);
            });
        break;
        default: // hubo error
            alert('Error en movimiento. Tipo: ' + xhr.status);
    }
}

function cbDetalleUsuario(xhr) {
    switch(xhr.status) {
        case 200:
            // let detalleUsuario = JSON.parse(xhr.response);
            userList.push(JSON.parse(xhr.response));
            // console.log(userList);
            userListToHTML(userList);
        break;
        default: //hubo error
            alert('Error en movimiento. Tipo: ' + xhr.status);
    }
}

function cbLupa(email) {
    console.log(email);
    localStorage.setItem('userEmail', email);
    window.location.href = '../Tarea 7 - Practica 3/detalle.html';
}

function Editar(email) {
    // console.log(email);
    makeHTTPRequestUsuarios(`/api/users/${email}`, 'GET',
                            {'x-auth': localStorage.token, 'x-user-token': localStorage.token},
                            '', displayEditUser);
}
function displayEditUser(xhr) {
    let user = JSON.parse(xhr.response);
    // console.log(email);
    // console.log(user);
    document.getElementById('firstNameEdit').value = user.nombre;
    document.getElementById('lastNameEdit').value = user.apellido;
    document.getElementById('emailEdit').value = user.correo;
    document.getElementById('pwEdit').value = user.password;
    document.getElementById('confirmPWEdit').value = user.password;
    document.getElementById('dateEdit').value = user.fecha;
    if(user.sexo == 'M') {
        document.getElementById('MEdit').setAttribute('checked', '');
        document.getElementById('HEdit').removeAttribute('checked');
    } else {
        document.getElementById('HEdit').setAttribute('checked', '');
        document.getElementById('MEdit').removeAttribute('checked');
    }
    document.getElementById('urlEdit').value = user.url;
    if(document.getElementById('pwEdit').value != document.getElementById('confirmPWEdit').value) {
        document.getElementById('submitEdit').setAttribute('disabled', '');
    } else {
        document.getElementById('submitEdit').removeAttribute('disabled');
    }
}
function submitEdit(event) {
    event.preventDefault();
    let user = {
        nombre: document.getElementById('firstName').value,
        apellido: document.getElementById('lastName').value,
        correo: document.getElementById('email').value,
        url: document.getElementById('url').value,
        sexo: document.querySelector('[name=sexo]:checked').value,
        fecha: document.getElementById('date').value,
        password: document.getElementById('pw').value
    }
    console.log(user);
    makeHTTPRequestUsuarios(`/api/users/${user.correo}`, 'PUT',
                            {'Content-Type': 'application/json; charset=utf-8', 'x-auth': localStorage.token, 'x-user-token': localStorage.token},
                            user,
                            (xhr) => {
                                if(xhr.status == 200) {
                                    alert('Usuario actualizado');
                                    window.location.reload(true);
                                } else {
                                    alert('Error: ' + xhr.status);
                                }
                            });
}

function cbDelete(email) {
    // console.log(email);
    makeHTTPRequestUsuarios(`/api/users/${email}`, 'GET',
                            {'x-auth': localStorage.token, 'x-user-token': localStorage.token},
                            '', displayDeleteUser);
}
function displayDeleteUser(xhr) {
    let user = JSON.parse(xhr.response);
    // console.log(email);
    // console.log(user);
    document.getElementById('firstNameDelete').value = user.nombre;
    document.getElementById('lastNameDelete').value = user.apellido;
    document.getElementById('emailDelete').value = user.correo;
    document.getElementById('pwDelete').value = user.password;
    document.getElementById('dateDelete').value = user.fecha;
    if(user.sexo == 'M') {
        document.getElementById('MDelete').setAttribute('checked', '');
        document.getElementById('HDelete').removeAttribute('checked');
    } else {
        document.getElementById('HDelete').setAttribute('checked', '');
        document.getElementById('MDelete').removeAttribute('checked');
    }
    document.getElementById('urlDelete').value = user.url;
    document.getElementById('submitDelete');
    correo = user.correo;
}
function submitDelete(event) {
    event.preventDefault();
    
    makeHTTPRequestUsuarios(`/api/users/${correo}`, 'DELETE',
                            {'Content-Type': 'application/json;', 'x-auth': localStorage.token, 'x-user-token': localStorage.token},
                            '',
                            (xhr) => {
                                if(xhr.status == 200) {
                                    alert('Usuario eliminado');
                                    window.location.reload(true);
                                } else {
                                    alert('Usuario no encontrado. Error: ' + xhr.status);
                                }
                            });
}

function makeHTTPRequestUsuarios(endpoint, method, headers, data, cb){
    // 1. crear XMLHttpRequest object
    let xhr = new XMLHttpRequest();
    // 2. configurar: PUT actualizar archivo
    xhr.open(method, baseURl+endpoint);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('x-auth', 'application/json');
    for(let key in headers) {
        xhr.setRequestHeader(key, headers[key]);
    }
    // 4. Enviar solicitud
    xhr.send(JSON.stringify(data));
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = () => {
        // console.log(xhr.response);
        cb(xhr);
    }
}

function userToHTML(user) {
    let sexo = (user.sexo == 'H') ? 'Hombre' : 'Mujer';
    let sResultado = `<div class="media col-8 mt-2">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" src="${user.url}">
        </div>
        <div class="media-body">
            <h4>${user.nombre} ${user.apellido}</h4>
            <p >Correo: ${user.correo}</p>
            <p >Fecha de nacimiento: ${user.fecha}</p>
            <p >Sexo: ${sexo} </p>
        </div>
        <div class="media-right align-self-center">
            <div class="row" onclick="cbLupa('${user.correo}')">
                <a href="#" class="btn btn-primary edit"><i class="fas fa-search edit  "></i></a>
            </div>
            <div class="row" onclick="Editar('${user.correo}')">
                <a href="#" class="btn btn-primary mt-2" data-toggle="modal" data-target="#editarUsuario"><i class="fas fa-pencil-alt edit  "></i></a>
            </div>
            <div class="row" onclick="cbDelete('${user.correo}')">
                <a href="#" class="btn btn-primary mt-2" data-toggle="modal" data-target="#eliminarUsuario"><i class="fas fa-trash-alt  remove "></i></i></a>
            </div>
        </div>
    </div>
    `;
    return sResultado;
}

function userListToHTML(usuarios) {
   
    let usuario = usuarios.map(user => { 
        return userToHTML(user);
    });
    document.getElementById('info').innerHTML = usuario.join('');
}

const baseURl = 'https://users-dasw.herokuapp.com';


