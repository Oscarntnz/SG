import * as THREE from '../libs/three.module.js'
import * as ThreeBSP from '../libs/ThreeBSP.js'

class MyTuerca extends THREE.Object3D {
	constructor(gui) {
		super();

        var cilGeo = new THREE.CylinderBufferGeometry(2, 2, 2, 6);

        // agujero central

        var cilCentGeo = new THREE.CylinderBufferGeometry(1, 1, 4, 30);
        var hendidurasGeo = [];

        for(let i = 0; i < 9; i++)
            hendidurasGeo.push(new THREE.CylinderBufferGeometry(1.1, 1.1, 0.1, 30));

        for(let i = 0; i < hendidurasGeo.length; i++)
            hendidurasGeo[i].translate(0, 0.8 - 0.2*i, 0);

        var picos = [];

        for(let i = 0; i < 12; i++)
            picos.push(new THREE.BoxBufferGeometry(0.5, 0.5, 0.5));

        for(let i = 0; i < picos.length; i++) {
            if(i < picos.length/2){
                picos[i].rotateX(-Math.PI/4);
                picos[i].translate(0, 1.1, 2.1);
            }
            else{
                picos[i].rotateX(Math.PI/4);
                picos[i].translate(0, -1.1, 2.1);
            }
        }

        for(let i = 0; i < picos.length; i++){
            let angulo = i%(picos.length/2) * 2*Math.PI/(picos.length/2);

            picos[i].rotateY(angulo);
        }

        // BSP

        var cilBSP = new ThreeBSP.ThreeBSP(cilGeo);
        var cilCBSP = new ThreeBSP.ThreeBSP(cilCentGeo);

        var hendidurasBSP = [];
        var picosBSP = [];

        for(let i = 0; i < hendidurasGeo.length; i++)
            hendidurasBSP[i] = new ThreeBSP.ThreeBSP(hendidurasGeo[i]);

        for(let i = 0; i < picos.length; i++)
            picosBSP[i] = new ThreeBSP.ThreeBSP(picos[i]);


        var final = cilBSP.subtract(cilCBSP);

        for(let i = 0; i < hendidurasBSP.length; i++)
            final = final.subtract(hendidurasBSP[i]);

        for(let i = 0; i < picosBSP.length; i++)
            final = final.subtract(picosBSP[i]);

        // fin BSP

        var finalGeo = new THREE.BufferGeometry().fromGeometry(final.toGeometry());
        var material = new THREE.MeshNormalMaterial();
        this.final = new THREE.Mesh(finalGeo, material);

        this.add(this.final);
	}

	update() {
	}
}

export { MyTuerca };
