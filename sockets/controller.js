const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    
    // Enviamos el ultimo ticket al socket
    socket.emit('ultimo-ticket', ticketControl.ultimo);

    // Enviamos los 4 ultimos tickets
    socket.emit('estado-actual', ticketControl.ultimos4);

    // Enviamos los tickets que quedan por atender
    socket.emit('tickets-pendientes', ticketControl.tickets.length);

    // Hacemos la llamada al siguiente ticket
    socket.on('siguiente-ticket', ( payload, callback ) => {
        
        const siguiente = ticketControl.siguiente();
        callback( siguiente );
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

    } );

    // Recibimos el escritorio para atender el ticket
    socket.on('atender-ticket', ( payload, callback ) => {

        const { escritorio } = payload;

        if( !escritorio ) {
            return callback({
                ok: false,
                msg: 'El escritorio es necesario'
            })
        }

        // Enviamos el escritorio y obtenemos el ticket
        const ticket = ticketControl.atenderTicket(escritorio);
        // Enviamos los 4 ultimos tickets a todas las pantallas con .broadcast
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4);
        // Enviamos los tickets que quedan por atender
        socket.emit('tickets-pendientes', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length);

        // Comprobamos que haya ticket disponible.
        if( !ticket ) {

            callback({
                ok: false,
                msg: 'Ya no hay tickets pendientes'
            });

        }else {

            callback({
                ok: true,
                ticket
            });

        }

    })

}



module.exports = {
    socketController
}

