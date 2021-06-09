// Alumno: Antunez Martinaitis, Oscar

import * as THREE from '../libs/three.module.js'
import {TipoBloques} from './TipoBloques.js'

class Bloque extends THREE.Group {
    static TEXTURABLOQUE;

	constructor(tam, tipo, color = null, alfa = 1.0) {
		super();

        // Si no se ha inicializado, se carga
        if(Bloque.TEXTURABLOQUE === null || Bloque.TEXTURABLOQUE === undefined) {
            let loader = new THREE.TextureLoader();
            Bloque.TEXTURABLOQUE = loader.load('../imgs/textura_bloque.png');
        }

        this.tipo = tipo.toUpperCase();
        this.tamBloque = tam;
		this.bloque = this.crearBloques(tam, color, alfa);
		this.add(this.bloque);
	}

    // Crea la geometria de 1 de las piezas que compone el bloque
	crearBloque(escala = 2) {
        let geometria = new THREE.BoxBufferGeometry(escala, escala, escala);
		
		return geometria;
	}

    // Crea las 4 piezas que componen un bloque
    crearBloques(escala = 2, color = null, alfa = 1.0) {
        this.tipo = this.tipo.toUpperCase();

        if(!TipoBloques.esValido(this.tipo))
            this.tipo = TipoBloques.predeterminado();

        if(color === null || color === undefined)
            color = TipoBloques.getColor(this.tipo);

        let transparente = alfa == 1.0? false : true;
        
        this.material = new THREE.MeshPhongMaterial({color: color, map: Bloque.TEXTURABLOQUE,
        opacity: alfa, transparent: transparente});

        let bloques;
        let pos = [];

        // Se crea la posicion absoluta y relativa (2D) de las piezas
        switch(this.tipo) {
            case 'I':
                pos = [
                    new THREE.Vector3(-escala, 0, 0, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(escala, 0, 0),
                    new THREE.Vector3(2*escala, 0, 0)
                ];
                this.posBloques = [
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(2, 1),
                    new THREE.Vector2(3, 1)
                ];
                this.centroRotacion = new THREE.Vector2(1, 1);  // En que posicion aplicamos las rotaciones relativas
                this.anchura = 4;
                this.altura = 1;

                bloques = this.generarBloque(escala, pos, color);

                bloques.position.x = -escala/2;
                bloques.position.y = -escala/2;
            break;

            case 'J':
                pos = [
                    new THREE.Vector3(-escala, 0, 0), 
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(escala, 0, 0),
                    new THREE.Vector3(escala, -escala, 0)
                ];
                this.posBloques = [
                    new THREE.Vector2(0, 0), 
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(2, 0),
                    new THREE.Vector2(2, 1)
                ];
                this.centroRotacion = new THREE.Vector2(1, 0);
                this.anchura = 3;
                this.altura = 2;

                bloques = this.generarBloque(escala, pos, color);

                bloques.position.x = -escala/2;
                bloques.position.y = escala/2;
            break;

            case 'L':
                pos = [
                    new THREE.Vector3(-escala, 0, 0),
                    new THREE.Vector3(-escala, -escala, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(escala, 0, 0)
                ];
                this.posBloques = [
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(2, 0)
                ];
                this.centroRotacion = new THREE.Vector2(1, 0);
                this.anchura = 3;
                this.altura = 2;

                bloques = this.generarBloque(escala, pos, color);

                bloques.position.x = -escala/2;
                bloques.position.y = escala/2;
            break;

            case 'O':
                pos = [
                    new THREE.Vector3(-escala/2, escala/2, 0), 
                    new THREE.Vector3(-escala/2, -escala/2, 0),
                    new THREE.Vector3(escala/2, escala/2, 0),
                    new THREE.Vector3(escala/2, -escala/2, 0)
                ];
                this.posBloques = [
                    new THREE.Vector2(0, 0), 
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(1, 1)
                ];
                this.centroRotacion = new THREE.Vector2(0.5, 0.5);
                this.anchura = 2;
                this.altura = 2;

                bloques = this.generarBloque(escala, pos, color);
            break;

            case 'S':
                pos = [
                    new THREE.Vector3(-escala, 0, 0), 
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, -escala, 0),
                    new THREE.Vector3(escala, -escala, 0)
                ];
                this.posBloques = [
                    new THREE.Vector2(0, 0),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(2, 1)
                ];
                this.centroRotacion = new THREE.Vector2(1, 0);
                this.anchura = 3;
                this.altura = 2;

                bloques = this.generarBloque(escala, pos, color);

                bloques.position.x = -escala/2;
                bloques.position.y = escala/2;
            break;

            case 'T':
                pos = [
                    new THREE.Vector3(-escala, 0, 0), 
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, -escala, 0),
                    new THREE.Vector3(escala, 0, 0)
                ];
                this.posBloques = [
                    new THREE.Vector2(0, 0), 
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(2, 0)
                ];
                this.centroRotacion = new THREE.Vector2(1, 0);
                this.anchura = 3;
                this.altura = 2;

                bloques = this.generarBloque(escala, pos, color);

                bloques.position.x = -escala/2;
                bloques.position.y = escala/2;
            break;

            case 'Z':
                pos = [
                    new THREE.Vector3(-escala, -escala, 0),
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(0, -escala, 0),
                    new THREE.Vector3(escala, 0, 0)
                ];
                this.posBloques = [
                    new THREE.Vector2(0, 1),
                    new THREE.Vector2(1, 0),
                    new THREE.Vector2(1, 1),
                    new THREE.Vector2(2, 0)
                ];
                this.centroRotacion = new THREE.Vector2(1, 0);
                this.anchura = 3;
                this.altura = 2;

                bloques = this.generarBloque(escala, pos, color);
                
                bloques.position.x = -escala/2;
                bloques.position.y = escala/2;
            break;

            case 'B':
                pos = [new THREE.Vector3(0, 0, 0)];
                this.posBloques = [new THREE.Vector2(0, 1)];
                this.centroRotacion = new THREE.Vector2(0, 0);
                this.anchura = 1;
                this.altura = 1;

                bloques = this.generarBloque(escala, pos, color);

                bloques.position.x = -escala/2;
                bloques.position.y = -escala/2;
            break;
        }

        return bloques;
    }

    // Funcion auxiliar de la anterior, crea las 4 piezas de un bloque
    generarBloque(escala, pos) {
        let final = new THREE.Group();
        
        pos.forEach((p) => {
            let bloqueGeo = this.crearBloque(escala);
            let bloque = new THREE.Mesh(bloqueGeo, this.material);
            
            bloque.position.set(p.x, p.y, p.z);

            final.add(bloque);
        });

        return final;
    }

    // Funcion para mover la pieza en coordenadas relativas
    desplazar(x = 0, y = 0) {
		this.position.x += x*this.tamBloque;
        this.position.y -= y*this.tamBloque;

        this.posBloques.forEach((e, i) => {
            this.posBloques[i].x += x;
            this.posBloques[i].y += y;
        });

        this.centroRotacion.x += x;
        this.centroRotacion.y += y;
	}

    // Mueve el bloque a x,y (relativo) dependiendo 
    // de las filas y columnas del tablero que usemos
    setPosicion(x, y, filas, columnas) {
        if(x < 0)
            x = 0;
        else if(x + this.anchura >= columnas)
            x = columnas - this.anchura;

        if(y < 0)
            y = 0;
        else if(y + this.altura >= filas)
            y = filas - this.altura;

        this.position.x += (x - columnas/2 + Math.round(this.anchura/2))*this.tamBloque;
        this.position.y += (filas/2 - y)*this.tamBloque;

        for(let i = 0; i < this.posBloques.length; i++) {
            this.posBloques[i].x += x;
            this.posBloques[i].y += y - 1;
        }

        this.centroRotacion.x += x;
        this.centroRotacion.y += y - 1;
    }

    // Copia tanto la posicion relativa como la absoluta
    copiarPosicion(otro) {
        this.position.x = otro.position.x;
        this.position.y = otro.position.y;
        
        this.posBloques.forEach((p, i) => {
            p.x = otro.posBloques[i].x;
            p.y = otro.posBloques[i].y;
        });

        this.centroRotacion.x = otro.centroRotacion.x;
        this.centroRotacion.y = otro.centroRotacion.y;
    }

    // Copia la posicion, la rotacion y las dimensiones
    copiarRotacion(otro) {
        this.copiarPosicion(otro);

        this.bloque.rotation.z = otro.bloque.rotation.z;

        this.altura = otro.altura;
        this.anchura = otro.anchura;
    }

    // Rota el objeto y las posiciones relativas
    rotar(posDestino = null) {
        if(this.tipo != 'O') {
            const angulo = Math.PI/2;

            this.bloque.rotation.z += angulo;

            if(posDestino !== null)
                this.posBloques = posDestino;
            else
                this.posBloques = this.rotarPosPiezas(-angulo);

            let aux = this.altura;
            this.altura = this.anchura;
            this.anchura = aux;
        }
	}

    // Rota las piezas sin modificar la posicion.
    // Se usa para comprobar colisiones sin tener que
    // deshacer el cambio
    rotarPosPiezas(angulo) {
        let puntos = [];

        this.posBloques.forEach((p, i) => {
            puntos.push(p.clone());

            puntos[i].rotateAround(this.centroRotacion, angulo);

            puntos[i].round();
        });

        return puntos;
    }

    // Se le pasa vector de posiciones relativas,
    // un offset (x, y), y devuelve true si
    // el bloque cubre ese area.
    cubreArea(area, x = 0, y = 0) {
        let cubre = false;

        for(let i = 0; i < this.posBloques.length && !cubre; i++) {
            area.forEach((p) => {
                if((p.x + x) == this.posBloques[i].x && (p.y + y) == this.posBloques[i].y) {
                    cubre = true;

                    return;
                }
            });
        }

        return cubre;
    }

    // Devuelve un vector de "pair" que contiene
    // los bloques que componen la pieza, y su posicion relativa
    devolverPiezasIndividuales() {
        let piezas = [];

        this.bloque.children.forEach((b, i) => {
            piezas.push([b, this.posBloques[i]]);
        });

        return piezas;
	}

    // Elimina el hijo que le pase y divide el bloque
    // actual en las piezas que le quedan, quitado su hijo.
    // devuelve el conjunto de bloques generados
    quitar(hijo, filas, columnas) {
        let that = this;
        let hijosRestantes = [];

        this.bloque.children.forEach((p, i) => {
            if (hijo !== p) {
                let nuevoHijo = new Bloque(that.tamBloque, 'B', TipoBloques.getColor(that.tipo));
                nuevoHijo.setPosicion(that.posBloques[i].x, that.posBloques[i].y, filas, columnas);

                hijosRestantes.push(nuevoHijo);
            }
            
            p.geometry.dispose();
        });

        this.material.dispose();

        return hijosRestantes;
    }

    // Destruye la geometria de los hijos, y el material
    destruir() {
        this.bloque.children.forEach((p, i) => {            
            p.geometry.dispose();
        });

        this.material.dispose();
    }
}

export { Bloque };
