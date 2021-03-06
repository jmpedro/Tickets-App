
// Obtenemos los elementos necesarios del HTML
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

// Obtenemos los parametros de la url
const searchParams = new URLSearchParams( window.location.search );

// Comprobamos que venga el parámetro escritorio
if( !searchParams.has('escritorio') ) {

    window.location = 'index.html';
    throw new Error('El parámetro escritorio es obligatorio');

}

// Obtenemos el valor del escritorio y lo mostramos en el html
const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
// Ocultamos la alerta
divAlert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    
    // Si estamos conectados al servidor, el botón esta activo
    btnAtender.disabled = false;

});

socket.on('disconnect', () => {
    
    // Si estamos desconectados al servidor, el botón esta inactivo
    btnAtender.disabled = true;

});

// Escuchamos el evento que recibimos de los tickets
socket.on('tickets-pendientes', (numeroTickets) => {

    if( numeroTickets === 0 ) {

        lblPendientes.style.display = 'none';

    }else {

        lblPendientes.style.display = '';
        lblPendientes.innerText = numeroTickets;

    }

} )

// Cuando hagamos click en el boton, el socket hara su funcion
btnAtender.addEventListener( 'click', () => {
    
    // Enviamos el escritorio al socket
    socket.emit('atender-ticket', { escritorio }, ( {ok, ticket} ) => {

        // Comprobamos que venga el ticket 
        if( !ok ) {
            lblTicket.innerText = 'Nadie';
            return divAlert.style.display = '';
        }

        lblTicket.innerText = 'Ticket' + ticket.numero;

    })

});