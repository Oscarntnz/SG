import * as THREE from '../libs/three.module.js'

class MyTrebol extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		this.createGUI(gui, titleGui);

		var base = new THREE.Shape();

		var puntos = [
			new THREE.Vector3(0, -1.5, 0),
			new THREE.Vector3(1, -1.5, 0),
			new THREE.Vector3(0.25, -1.0, 0),
			new THREE.Vector3(0.25, 1.5, 0),
		]

		base.moveTo(0.25, 1);
		base.bezierCurveTo(1, -1, 5, 0, 1.5, 2.5);
		base.bezierCurveTo(2.5, 5.5, -2.5, 5.5, -1.5, 2.5);
		base.bezierCurveTo(-5, 0, -1, -1, -0.25, 1);

		var material = new THREE.MeshLambertMaterial({color: new THREE.Color('blue')});

		var config = {depth: 1, bevelEnabled: true, bevelSegments: 5, steps: 3, bevelSize: .5, bevelThickness: .25};

		var geoPata = new THREE.LatheBufferGeometry(puntos, 30);
		var pata = new THREE.Mesh(geoPata, material);
		this.add(pata);
		pata.position.y -= 0.5;
		pata.position.z += 0.5;

		var geometria = new THREE.ExtrudeBufferGeometry(base, config);
		this.trebol = new THREE.Mesh(geometria, material);
		this.add(this.trebol);
	}

	createGUI(gui, titleGui) {
	}

	update() {
	}
}

export { MyTrebol };
