const path = require('path');
const fs = require('fs');


// Clase Ticket
class Ticket {

    constructor( numero, escritorio ) {

        this.numero = numero;
        this.escritorio = escritorio;

    }

}

class TicketControl {

    // Inicializamos las propiedades con las que vamos a trabajar
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimos4 = [];

        // Llamamos al metodo init
        this.init();
    }

    // Llamamos al metodo get
    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimos4: this.ultimos4
        }
    }

    // Iniciamos nuestra clase
    init() {

        const { ultimo, hoy, tickets, ultimos4 } = require('../db/data.json');
        // Comprobamos si estamos en el mismo dia, y si no guardamos los datos en nuestra BD
        if( hoy === this.hoy ) {

            this.ultimo = ultimo;
            this.tickets = tickets;
            this.ultimos4 = ultimos4;

        }else {

            this.guardarBD()

        }

    }

    // Guardamos los datos en nuestra BD
    guardarBD() {

        // Indicamos el archivo donde vamos a guardar los datos
        const dbPath = path.join(__dirname, '../db/data.json');
        // Guardamos los datos obtenidos en la BD
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));

    }

    // Método para obtener el siguiente ticket
    siguiente() {

        // El ultimo ticket pasa a la posicion siguiente
        this.ultimo += 1;
        // Creamos el nuevo ticket
        const ticket = new Ticket(this.ultimo, null);
        // Lo guardamos en el arreglo de tickets
        this.tickets.push(ticket);

        // Guardamos el arreglo en la BD
        this.guardarBD();

        return 'Ticket ' + ticket.numero;

    }

    // Metodo para atender el ticket actual
    atenderTicket(escritorio) {

        // Comprobamos que no tengamos tickets
        if( this.tickets.length === 0 ) {

            return null;

        }

        // Si tenemos tickets, eliminamos el primero de la lista de todos los tickets, y lo metemos en la lista de los ultimos4
        const ticket = this.tickets.shift();

        // Le asignamos el escritorio
        ticket.escritorio = escritorio;

        // .unshift() es igual que push solo que el valor introducido se guarda al principio del array
        this.ultimos4.unshift(ticket);

        // Si la longitud de los ultimos4 es mayor a 4, borramos el ultimo elemento
        if( this.ultimos4.length > 4 ) {
            
            this.ultimos4.splice(-1, 1);

        }   

        // Guardamos los datos
        this.guardarBD();

        return ticket;

    }

}

module.exports = TicketControl;