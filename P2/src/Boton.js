import * as THREE from '../libs/three.module.js'
import { Texto } from './Texto.js';

class Boton extends THREE.Group {
    static MATERIALSELECCIONADO;

    constructor(pos, texto, nombre, tam = 2) {
        super();

        if(Boton.MATERIALSELECCIONADO === null || Boton.MATERIALSELECCIONADO === undefined)
            Boton.MATERIALSELECCIONADO = new THREE.MeshStandardMaterial({color: 0xFF0000});
    
        this.nombre = nombre;
        this.texto = new Texto(pos, tam, texto);

        this.add(this.texto);

        this.seleccionado = false;
    }

    // Cambia de material, para que se vea diferente cuando es seleccionado
    // y el valor booleano
    cambiarSeleccion(valor) {
        if(this.texto.texto !== null && this.texto.texto !== undefined) {
            if(valor)
                this.texto.texto.material = Boton.MATERIALSELECCIONADO;
            else
                this.texto.texto.material = Texto.MATERIAL;
            
            this.seleccionado = valor;
        }
    }
}

export {Boton};