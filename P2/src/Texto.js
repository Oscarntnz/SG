import * as THREE from '../libs/three.module.js'

class Texto extends THREE.Group {
    static UBICACIONFUENTE = '../fonts/fuente_menu.json';
    static MATERIAL;

    constructor(posicion, tamanio, texto) {
        super();

        if(Texto.MATERIAL === null || Texto.MATERIAL === undefined)
            Texto.MATERIAL = new THREE.MeshStandardMaterial({color: 0xFFFFFF});

        let fontLoader = new THREE.FontLoader();
        let that = this;

        fontLoader.load(Texto.UBICACIONFUENTE, (f) => {
            let textoGeo = new THREE.TextGeometry(texto, {
                font: f,
                size: tamanio,
                height: tamanio/5
            });

            textoGeo.computeBoundingBox();
            textoGeo.center();

            that.texto = new THREE.Mesh(textoGeo, Texto.MATERIAL);
            that.texto.userData = that;

            that.add(that.texto);
            that.position.copy(posicion);
        });
    }

    destruir() {
        if(this.texto !== null && this.texto !== undefined) {
            this.texto.geometry.dispose();
            this.remove(this.texto);
        }
    }
}

export {Texto};