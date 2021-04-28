import * as THREE from '../libs/three.module.js'
import * as ThreeBSP from '../libs/ThreeBSP.js'

class MyTaza extends THREE.Object3D {
	constructor(gui) {
		super();

        var points = [];
        var material = new THREE.MeshNormalMaterial();

        for(let i = 0; i <= 360; i++)
            points.push(new THREE.Vector2(Math.sin(i*(Math.PI/180))*0.2, Math.cos(i*(Math.PI/180))*0.2));

        var circulo = new THREE.Shape(points);

        var tPoints = [];

        for(let i = 0; i <= 180; i++)
            tPoints.push(new THREE.Vector3(Math.sin(i*(Math.PI/180))*1.8, Math.cos(i*(Math.PI/180))*1.8, 0));

        var trayectoria = new THREE.CatmullRomCurve3(tPoints);

        var geometria = new THREE.ExtrudeBufferGeometry(circulo, {depth: 50, steps: 50, extrudePath: trayectoria});
        geometria.translate(2.45, 0, 0);
        var handle = new THREE.Mesh(geometria, material);

        var taza = new THREE.CylinderBufferGeometry(2.5, 2.5, 5, 50);
        var interior = new THREE.CylinderBufferGeometry(2.2, 2.2, 4.5, 50);

        interior.translate(0, 1, 0);

        var tazaBSP = new ThreeBSP.ThreeBSP(taza);
        var interiorBSP = new ThreeBSP.ThreeBSP(interior);

        var finalResult = tazaBSP.subtract(interiorBSP);

        var geometria = finalResult.toGeometry();
        var geometriaBuffer = new THREE.BufferGeometry().fromGeometry(geometria);

        var final = new THREE.Mesh(geometriaBuffer, material);
		
		this.add(final);
        this.add(handle);
	}

	update() {
	}
}

export { MyTaza };
