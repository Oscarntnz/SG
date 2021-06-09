import * as THREE from '../libs/three.module.js'
import { Boton } from './Boton.js';
import {Texto} from './Texto.js'

class Menu extends THREE.Object3D {
    constructor(posicion, tam = 2) {
        super();

        let posTitulo = posicion.clone();
        posTitulo.add(new THREE.Vector3(0, 10, 0));

        this.titulo = new Texto(posTitulo, 5, 'Falling');
        this.position.copy(posicion);
        this.titulo.userData = this;

        this.add(this.titulo);

        this.botones = [];
        this.botones.push(new Boton(posicion, 'FACIL', 'FACIL'));
        this.botones[this.botones.length - 1].position.x = -2*tam*tam;
        this.botones.push(new Boton(posicion, 'NORMAL', 'NORMAL'));
        this.botones.push(new Boton(posicion, 'DIFICIL', 'DIFICIL'));
        this.botones[this.botones.length - 1].position.x = 2*tam*tam;

        this.botones.forEach((b) => {
            this.add(b);
        });
    }

    getBotones() {
        return this.botones;
    }
}

export {Menu};