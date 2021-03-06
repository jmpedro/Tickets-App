
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
    
    // Si estamos conectados al servidor, el botón esta activo
    btnCrear.disabled = false;

});

socket.on('disconnect', () => {
    
    // Si estamos desconectados al servidor, el botón esta inactivo
    btnCrear.disabled = true;

});

// Escuchamos el mensaje del socket
socket.on('ultimo-ticket', (numeroTicket) => {

    lblNuevoTicket.innerText = 'Ticket ' + numeroTicket;

} );

// Cuando hagamos click en el boton, el socket hara su funcion
btnCrear.addEventListener( 'click', () => {
    
    // El socket escucha el mensaje del controlador, que es el ultimo ticket, y lo envia al servidor.
    socket.emit( 'siguiente-ticket', null, ( ticket ) => {

        lblNuevoTicket.innerText = ticket;

    });

});