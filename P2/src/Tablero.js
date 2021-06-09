// Alumno: Antunez Martinaitis, Oscar

import * as THREE from '../libs/three.module.js'
import * as ThreeBSP from '../libs/ThreeBSP.js'
import { Bloque } from './Bloque.js'
import { TipoBloques } from './TipoBloques.js';

class Tablero extends THREE.Object3D {
	static FILASPREDETERMINADO = 20;
	static COLUMNASPREDETERMINADO = 10;
	static COLOR = 0xEEEEEE;

	constructor(filas = Tablero.FILASPREDETERMINADO, columnas = Tablero.COLUMNASPREDETERMINADO, partida) {
		super();

		this.filas = filas;
		this.columnas = columnas;
		this.tablero = new THREE.Group();
		this.partida = partida;

		if(this.filas < 4)
			this.filas = 4;
		if(this.columnas < 4)
			this.columnas = 4;

		this.tamBloque = 2;
		var b = this.crearBloque(this.tamBloque + 0.1);

		this.piezas = new THREE.Group();
		this.vPiezas = [];

		this.tablero.bloques = [];
		this.tablero.bloques.push(b);

		for(let i = 1; i < filas*columnas; i++)
			this.tablero.bloques.push(b.clone());

		for(let i = 0; i < filas; i++)
			for(let j = 0; j < columnas; j++) {
				this.tablero.bloques[i*columnas + j].position.x = (j + 1/2 - columnas/2)*this.tamBloque;
				this.tablero.bloques[i*columnas + j].position.y = (filas/2 - i - 1/2)*this.tamBloque;

				this.tablero.add(this.tablero.bloques[i*columnas + j]);
			}

		this.add(this.tablero);
		this.add(this.piezas);

		this.matrizTablero = [];

		for(let i = 0; i < this.filas; i++)
			this.matrizTablero.push((new Array(this.columnas).fill(null)));
	}

	comenzarJuego() {
		this.generarSiguiente();
		this.generarPieza();
	}

	crearBloque(escala = 2) {
		let bloqueGeo = new THREE.BoxGeometry(escala, escala, escala);
		let bloqueInterior = new THREE.BoxGeometry(escala - 0.2, escala - 0.2, escala);
		let bloqueInterior2 = bloqueInterior.clone();
		let bloqueInterior3 = bloqueInterior.clone();

		bloqueInterior2.rotateX(Math.PI/2);
		bloqueInterior3.rotateY(Math.PI/2);

		let bloqueBSP = new ThreeBSP.ThreeBSP(bloqueGeo);
        let bloqueIBSP = new ThreeBSP.ThreeBSP(bloqueInterior);
		let bloqueI2BSP = new ThreeBSP.ThreeBSP(bloqueInterior2);
		let bloqueI3BSP = new ThreeBSP.ThreeBSP(bloqueInterior3);

		let bloquesIBSP = bloqueIBSP.union(bloqueI2BSP).union(bloqueI3BSP);

		let finalBSP = bloqueBSP.subtract(bloquesIBSP);

		let finalGeo = finalBSP.toGeometry();

        let material = new THREE.MeshBasicMaterial({color: Tablero.COLOR});
        let meshFinal = new THREE.BufferGeometry().fromGeometry(finalGeo);
        let final = new THREE.Mesh(meshFinal, material);
		
		return final;
	}

	generarSiguiente(tipo = null) {
		if(tipo === null || tipo === undefined)
				tipo = TipoBloques.aleatorio();

		this.siguiente = new Bloque(this.tamBloque, tipo);
	}

	generarPieza(tipo = null) {
		if(!this.comprobarTecho()) {
			if(tipo === null || tipo === undefined)
				tipo = TipoBloques.aleatorio();

			let pieza = this.siguiente;
			pieza.position.set(0,0,0);
			let preview = new Bloque(pieza.tamBloque, pieza.tipo, null, 0.5);
			const posicion = new THREE.Vector2(Math.floor(this.columnas/2) - Math.round(pieza.anchura/2), 0);

			pieza.setPosicion(posicion.x, posicion.y, this.filas, this.columnas);
			preview.copiarPosicion(pieza);

			this.piezas.add(pieza);
			this.vPiezas.push(pieza);

			this.piezas.add(preview);

			this.piezaActiva = pieza;
			this.preview = preview;

			this.tumbarPieza(this.preview);

			this.generarSiguiente();
			this.partida.actualizarSiguiente(this.siguiente);
		}
		else
			this.partida.finDeJuego();
	}

	bajarPieza(pieza = null, tumbada = false) {
		if(pieza === null || pieza === undefined)
			pieza = this.piezaActiva;

		if(pieza !== null) {
			if(!this.comprobarSuelo(pieza) && 
				!this.comprobarColision(pieza, 0, 1)) {
					if(tumbada) {
						pieza.posBloques.forEach((p) => {
							this.matrizTablero[p.y][p.x] = null;
						});
					}

					pieza.desplazar(0, 1);

					if(tumbada) {
						pieza.posBloques.forEach((p, i) => {
							this.matrizTablero[p.y][p.x] = pieza.bloque.children[i];
						});
					}

					return true;
				}
			else {
				this.registraPieza(pieza);

				if(pieza === this.piezaActiva) {
					this.quitarPiezaActiva();
					this.comprobarFilas();
					this.generarPieza();
				}
			}
		}

		return false;
	}

	quitarPiezaActiva() {
		this.piezas.remove(this.preview);
		this.preview.destruir();
		
		this.piezaActiva = null;
		this.preview = null;
	}

	tumbarPieza(pieza = null) {
		if(pieza === null || pieza === undefined)
			pieza = this.piezaActiva;

		let bajado = 0;

		while(this.bajarPieza(pieza))
			bajado++;

		return bajado;
	}

	desplazarHorizontalmente(direccion) {
		if(this.piezaActiva !== null) {
			let desplazamiento = 0;

			if(direccion.toUpperCase() == 'I')
				desplazamiento = -1;
			else if(direccion.toUpperCase() == 'D')
				desplazamiento = 1;

			if(!this.chocaParedes(this.piezaActiva, desplazamiento) && 
			!this.comprobarColision(this.piezaActiva, desplazamiento)) {
				this.piezaActiva.desplazar(desplazamiento, 0);

				this.preview.copiarPosicion(this.piezaActiva);
				this.tumbarPieza(this.preview);
			}
		}
	}

	comprobarColision(pieza, x = 0, y = 0) {
		let choca = false;

		this.vPiezas.forEach((p) => {
			if(p !== pieza && p.cubreArea(pieza.posBloques, x, y)) {
				if(!(pieza == this.preview && p == this.piezaActiva)) {
					choca = true;

					return;
				}
			}
		});
		
		return choca;
	}

	comprobarSuelo(pieza) {
		let choca = false;

		pieza.posBloques.forEach((p) => {
			if(p.y >= this.filas - 1) {
				choca = true;
				
				return;
			}
		});

		return choca;
	}

	comprobarTecho() {
		let choca = false;

		this.matrizTablero[0].forEach((e) => {
			if(e !== null) {
				choca = true;

				return;
			}
		});

		return choca;
	}

	chocaParedes(pieza, desplazamiento = 0) {
		let choca = false;

		pieza.posBloques.forEach((p) => {
			if((p.x + desplazamiento) < 0 || 
			(p.x + desplazamiento) >= this.columnas) {
				choca = true;
				
				return;
			}
		});

		return choca;
	}

	registraPieza(pieza = null) {
		if(pieza === null || pieza === undefined)
			pieza = this.piezaActiva;

		if(pieza !== null && pieza != this.preview) {
			let bloquesIndividuales = pieza.devolverPiezasIndividuales();

			bloquesIndividuales.forEach((e) => {
				if(e[1].y >= 0)
					this.matrizTablero[e[1].y][e[1].x] = e[0];
			});
		}
	}

	comprobarFilas() {
		let i = this.filas - 1;
		let filasLimpiadas = 0;

		while(i >= 0) {
			if(this.comprobarFila(i)) {
				this.limpiarFila(i);

				this.aplicarCaida(i);

				filasLimpiadas++;
				i = this.filas - 1;
			}
			else
				i--;
		}

		this.partida.sumarLimpiadaFilas(filasLimpiadas);
	}

	limpiarFila(fila) {
		let f = this.matrizTablero[fila];

		f.forEach((c, j) => {
			if(c !== null) {	// Volver a comprobar si ha cambiado la matriz
				let pieza = c.parent.parent;
				let nuevosHijos = pieza.quitar(c, this.filas, this.columnas);
				this.quitarPieza(pieza);
				this.matrizTablero[fila][j] = null;

				nuevosHijos.forEach((h) => {
					let pos = h.posBloques[0];
						
					if(pos.y != fila) {	// Solo lo cogemos si no coincide con la fila limpiada
						this.matrizTablero[pos.y][pos.x] = h.bloque.children[0];

						this.addPieza(h);
					}
					else
						this.matrizTablero[pos.y][pos.x] = null;
				});
			}

		});
	}

	aplicarCaida(fila) {
		let techo = false;

		for(let i = fila - 1; i > 0 && !techo; i--) {
			for(let j = 0; j < this.columnas; j++)
				if(this.matrizTablero[i][j] !== null) {
					let pieza = this.matrizTablero[i][j];

					while(this.bajarPieza(pieza.parent.parent, true));
				}

			if(i >= 2)	techo = this.matrizTablero[i - 2].every(c => c !== null);
		}
	}

	// Devuelve true cuando la fila esta llena

	comprobarFila(fila) {
		return this.matrizTablero[fila].every(c => c !== null);
	}

	addPieza(pieza) {
		this.piezas.add(pieza);

		this.vPiezas.push(pieza);
	}

	quitarPieza(pieza) {
		if(pieza == this.piezaActiva)
			this.piezas.remove(this.preview);

		this.piezas.remove(pieza);

		const i = this.vPiezas.indexOf(pieza);
		this.vPiezas.splice(i, 1);
	}

	comprobarRotacion(pieza, posRotado) {
		let choca = false;

		posRotado.forEach((p) => {
			if(p.x < 0 || p.x >= this.columnas) {
				choca = true;
				
				return;
			}
		});

		this.vPiezas.forEach((p) => {
			if(p !== pieza && p.cubreArea(posRotado, 0, 0)) {
				choca = true;

				return;
			}
		});
		
		return choca;
	}

	rotar() {
		let posRotado = this.piezaActiva.rotarPosPiezas(-Math.PI/2);

		if(!this.comprobarRotacion(this.piezaActiva, posRotado)) {
			this.piezaActiva.rotar(posRotado);

			this.preview.copiarRotacion(this.piezaActiva);
			this.tumbarPieza(this.preview);
		}
	}
}

export { Tablero };
