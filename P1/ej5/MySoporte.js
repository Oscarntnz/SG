import * as THREE from '../libs/three.module.js'
import * as ThreeBSP from '../libs/ThreeBSP.js'

class MySoporte extends THREE.Object3D {
	constructor(gui) {
		super();

        var rectangulo1 = new THREE.BoxBufferGeometry(2, 5, 0.5);
        var rectangulo2 = new THREE.BoxBufferGeometry(2, 5, 0.5);
        var cil = new THREE.CylinderBufferGeometry(0.5, 0.5, 2);
        var cil2 = cil.clone();
        var cil3 = new THREE.CylinderBufferGeometry(0.2, 0.2, 0.5, 20);
        var esf = new THREE.SphereBufferGeometry(0.5, 20);
        var cil4 = cil3.clone();
        var esf2 = esf.clone();

        rectangulo2.rotateX(Math.PI/2);
        rectangulo2.translate(0, 2.25, 2.25);

        cil.rotateX(Math.PI/2);
        cil.rotateY(Math.PI/2);
        cil.translate(0, 2, 0.25);
        cil2.rotateX(Math.PI/2);
        cil2.rotateY(Math.PI/2);
        cil2.translate(0, 1.5, 0.75);

        cil3.translate(0, 2.25, 3.5);
        esf.translate(0, 1.75, 3.5);

        esf2.translate(0, -0.5, 0);
        cil4.rotateX(-Math.PI/2);
        esf2.rotateX(-Math.PI/2);
        esf2.translate(0, -1.75, 0);
        cil4.translate(0, -1.75, 0);

        var rectangulo1BSP = new ThreeBSP.ThreeBSP(rectangulo1);
        var rectangulo2BSP = new ThreeBSP.ThreeBSP(rectangulo2);
        var cilBSP = new ThreeBSP.ThreeBSP(cil);
        var cil2BSP = new ThreeBSP.ThreeBSP(cil2);
        var cil3BSP = new ThreeBSP.ThreeBSP(cil3);
        var esfBSP = new ThreeBSP.ThreeBSP(esf);
        var cil4BSP = new ThreeBSP.ThreeBSP(cil4);
        var esf2BSP = new ThreeBSP.ThreeBSP(esf2);

        var rectangulos = rectangulo1BSP.union(rectangulo2BSP);
        var camino = cilBSP.subtract(cil2BSP);
        var rects = rectangulos.union(camino);

        var agujero = cil3BSP.union(esfBSP);
        var agujero2 = cil4BSP.union(esf2BSP);

        var final = rects.subtract(agujero);
        final = final.subtract(agujero2);
        
        var finalGeo = final.toGeometry();

        var material = new THREE.MeshNormalMaterial();
        var meshFinal = new THREE.BufferGeometry().fromGeometry(finalGeo);
        this.final = new THREE.Mesh(meshFinal, material);
        this.cil4 = new THREE.Mesh(cil4, material);
        this.esf2 = new THREE.Mesh(esf2, material);
		
		this.add(this.final);
	}

	update() {
	}
}

export { MySoporte };
