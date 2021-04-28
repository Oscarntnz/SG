import * as THREE from '../libs/three.module.js'

class MyRombo extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		this.createGUI(gui, titleGui);

		var base = new THREE.Shape();

		base.moveTo(0, -3);
		base.lineTo(2, 0);
		base.lineTo(0, 3);
		base.lineTo(-2, 0);
		base.lineTo(0, -3);

		var material = new THREE.MeshLambertMaterial({color: new THREE.Color('red')});

		var config = {depth: 1, bevelEnabled: true, bevelSegments: 5, steps: 3, bevelSize: .5, bevelThickness: .25};

		var geometria = new THREE.ExtrudeBufferGeometry(base, config);
		this.trebol = new THREE.Mesh(geometria, material);
		this.add(this.trebol);
	}

	createGUI(gui, titleGui) {
	}

	update() {
	}
}

export { MyRombo };
