// Alumno: Antunez Martinaitis, Oscar

import * as THREE from '../libs/three.module.js'
import * as ThreeBSP from '../libs/ThreeBSP.js'

class Tablero extends THREE.Object3D {
	static FILASPREDETERMINADO = 20;
	static COLUMNASPREDETERMINADO = 10;

	constructor(filas = Tablero.FILASPREDETERMINADO, columnas = Tablero.COLUMNASPREDETERMINADO) {
		super();

		this.filas = filas;
		this.columnas = columnas;
		this.tablero = new THREE.Group();
		var tamBloque = 2;
		var b = this.crearBloque(tamBloque);

		this.tablero.bloques = [];
		this.tablero.bloques.push(b);

		for(let i = 1; i < filas*columnas; i++)
			this.tablero.bloques.push(b.clone());

		for(let i = 0; i < filas; i++)
			for(let j = 0; j < columnas; j++) {
				this.tablero.bloques[i*j].position.x = (j - columnas/2)*2;
				this.tablero.bloques[i*j].position.y = (filas/2 - i)*2;

				this.tablero.add(this.tablero.bloques[i*j]);
			}

		this.add(this.tablero);
	}

	crearBloque(escala = 2) {
		var bloqueGeo = new THREE.BoxGeometry(escala, escala, escala);
		var bloqueInterior = new THREE.BoxGeometry(escala - 0.2, escala - 0.2, escala);
		var bloqueInterior2 = bloqueInterior.clone();
		var bloqueInterior3 = bloqueInterior.clone();

		bloqueInterior2.rotateX(Math.PI/2);
		bloqueInterior3.rotateY(Math.PI/2);

		var bloqueBSP = new ThreeBSP.ThreeBSP(bloqueGeo);
        var bloqueIBSP = new ThreeBSP.ThreeBSP(bloqueInterior);
		var bloqueI2BSP = new ThreeBSP.ThreeBSP(bloqueInterior2);
		var bloqueI3BSP = new ThreeBSP.ThreeBSP(bloqueInterior3);

		var bloquesIBSP = bloqueIBSP.union(bloqueI2BSP).union(bloqueI3BSP);

		var finalBSP = bloqueBSP.subtract(bloquesIBSP);

		var finalGeo = finalBSP.toGeometry();

        var material = new THREE.MeshStandardMaterial({color: 0x8F9790});
        var meshFinal = new THREE.BufferGeometry().fromGeometry(finalGeo);
        var final = new THREE.Mesh(meshFinal, material);
		
		return final;
	}

	createLine() {
	}

	update() {
	}
}

export { Tablero };
