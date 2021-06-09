import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { Tablero } from './Tablero.js'
import { Teclas } from './Teclas.js'
import { Texto } from './Texto.js'

class Partida extends THREE.Group {
    static DIFICULTADES = {FACIL: {filas: 20, columnas: 10, velocidad: 2000}, 
    NORMAL: {filas: 15, columnas: 10, velocidad: 1500},
    DIFICIL: {filas: 16, columnas: 7, velocidad: 1000}};

    constructor(dificultad) {
        super();

        let filas = Partida.DIFICULTADES[dificultad]['filas'];
        let columnas = Partida.DIFICULTADES[dificultad]['columnas'];
        this.nivel = 1;
        this.puntuacion = 0;
        this.puntuacionParaSiguienteNivel = 2000;
        this.velocidad = Partida.DIFICULTADES[dificultad]['velocidad'];
        this.acabada = false;

        this.tablero = new Tablero(filas, columnas, this);
		this.add(this.tablero);

        // Textos de puntuacion, nivel, siguiente bloque
        this.textoPuntuacionPosicion = new THREE.Vector3(columnas*2, -filas/2 - 4, 0);
        this.textoTituloPuntuacion = new Texto(new THREE.Vector3(columnas*2, -filas/2, 0), 2, 'Puntuacion');
        this.textoPuntuacion = new Texto(this.textoPuntuacionPosicion, 2, this.puntuacion.toString());

        this.textoNivelPosicion = new THREE.Vector3(columnas*2, -2, 0);
        this.textoTituloNivel = new Texto(new THREE.Vector3(columnas*2, 2, 0), 2, 'Nivel');
        this.textoNivel = new Texto(this.textoNivelPosicion, 2, this.nivel.toString());

        this.siguientePos = new THREE.Vector3(columnas*2, filas/2, 0);
        this.textoTituloSiguiente = new Texto(new THREE.Vector3(columnas*2, filas/2 + 4, 0), 2, 'Siguiente');

        this.add(this.textoTituloPuntuacion);
        this.add(this.textoPuntuacion);

        this.add(this.textoTituloNivel);
        this.add(this.textoNivel);

        this.add(this.textoTituloSiguiente);
    }

    // Inicia la animacion de tween y le avia a tablero
    iniciarPartida() {
        if(!this.acabada) {
            this.iniciarAnimacionPiezas();
            this.tablero.comenzarJuego();
        }
    }

    // Suma la cantidad correspondiente con el numero
    // de filas
    sumarLimpiadaFilas(num) {
        if(num > 0) {
            switch(num) {
            case 1:
                this.sumarPuntuacion(100);
            break;
            case 2:
                this.sumarPuntuacion(300);
            break;
            case 3:
                this.sumarPuntuacion(500);
            break;
            case 4:
                this.sumarPuntuacion(800);
            break;
            default:
                this.sumarPuntuacion(800 + 100*(num - 4));
            break;
            }
        }
    }

    // Suma la puntuacion, actualiza el texto, y comprueba
    // si se ha superado el nivel
    sumarPuntuacion(num) {
        this.puntuacion += num;
        this.actualizarTextoPuntuacion();

        if(this.puntuacion >= this.puntuacionParaSiguienteNivel)
            this.siguienteNivel();
    }

    // Quita el texto de la partida, y lo recrea con la puntuacion
    // adecuada
    actualizarTextoPuntuacion() {
        this.remove(this.textoPuntuacion);
        this.textoPuntuacion.destruir();
        this.textoPuntuacion = new Texto(this.textoPuntuacionPosicion, 2, this.puntuacion.toString());
        this.add(this.textoPuntuacion);
    }

    actualizarTextoNivel() {
        this.remove(this.textoNivel);
        this.textoNivel.destruir();
        this.textoNivel = new Texto(this.textoNivelPosicion, 2, this.nivel.toString());
        this.add(this.textoNivel);
    }

    // Actualiza las variables correspondientes a la hora
    // de subir de nivel
    siguienteNivel() {
        this.puntuacionParaSiguienteNivel *= 3;
        this.velocidad /= 2;
        this.nivel++;
        this.actualizarVelocidad();
        this.actualizarTextoNivel();

        console.log("Nivel: " + this.nivel.toString());
    }

    // Crea la animacion de Tween, la cual llama cada this.velocidad
    // a bajarPieza de tablero
    iniciarAnimacionPiezas() {
		let pIni = {y : 0}, pFin = {y : 1};
		let that = this;

		this.animacionPiezas = new TWEEN.Tween(pIni).to(pFin, this.velocidad)
		.onRepeat(function() {
			that.tablero.bajarPieza();
		})
		.repeat(Infinity).start();
	}

    // Crea de nuevo la animacion de gravedad, con la
    // velocidad actualizada
    actualizarVelocidad() {
        this.acabarAnimacionPiezas();
        this.iniciarAnimacionPiezas();
    }

	acabarAnimacionPiezas() {
		this.animacionPiezas.stop();
	}

    // Realiza la accion correspondiente con el boton
    // presionado
    procesarBoton(e) {
        if(!this.acabada) {
            let codigo = e.which || e.keyCode;
            let valorCodigo = parseInt(codigo);

            if(valorCodigo >= 37 && valorCodigo <= 40) {
                let flecha = Teclas.FLECHAS[codigo];

                if(flecha == 'I' || flecha == 'D')
                    this.tablero.desplazarHorizontalmente(flecha);
                else if(flecha == 'AB') {
                    if(this.tablero.bajarPieza())
                        this.sumarBajada();
                }
                else if(flecha == 'AR')
                    this.tablero.rotar();
            }
            else if(valorCodigo == 32){
                let tecla = Teclas.ESPECIALES[codigo];

                if(tecla == 'ESPACIO') {
                    let filas = this.tablero.tumbarPieza();

                    if(filas > 0)
                        this.sumarBajada(2*filas);
                }
            }
        }
    }

    // Suma el numero de filas que ha
    // bajado
    sumarBajada(filas = 1) {
        this.sumarPuntuacion(filas);
    }

    // Finaliza la animacion de gravedad
    // e inicia la de fin de juego
    finDeJuego() {
        this.acabada = true;
        this.acabarAnimacionPiezas();
        this.animacionFinDeJuego();
        console.log("Fin de juego");
    }

    // Crea e inicia la animacion de fin de juego
    // que es solamente un texto que se desplaza
    // desde arriba hasta el centro de la camara
    animacionFinDeJuego() {
        let that = this;
        this.textoFinJuego = new Texto(new THREE.Vector3(0, this.tablero.filas + 10, 4), 5, 'Fin de juego');
        this.add(this.textoFinJuego);

        let pIni = {y : this.tablero.filas + 10}, pFin = {y : 0};

		this.animacionFinJuego = new TWEEN.Tween(pIni).to(pFin, 2000).onUpdate((p) => {
            that.textoFinJuego.position.y = p.y;
        }).start();
    }

    // Anade al grupo el siguiente bloque que saldra en el
    // tablero
    actualizarSiguiente(siguiente) {
        if(this.siguiente !== undefined || this.siguiente !== null)
            this.remove(this.siguiente);

        this.siguiente = siguiente;
        this.siguiente.position.copy(this.siguientePos);
        this.add(this.siguiente);
    }
}

export {Partida};
