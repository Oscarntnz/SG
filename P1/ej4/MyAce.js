import * as THREE from '../libs/three.module.js'

class MyAce extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		this.createGUI(gui, titleGui);

		var base = new THREE.Shape();

		base.moveTo(0, -2);
		base.lineTo(0.5, -2);
		base.lineTo(0.25, -1.5);
		base.lineTo(0.25, 1);
		base.bezierCurveTo(1, -1, 5, 0, 1.5, 2.5);

		base.bezierCurveTo(1, 2.6, 0.5, 3.5, 0, 5);
		base.bezierCurveTo(-0.5, 3.5, -1, 2.6, -1.5, 2.5);

		base.bezierCurveTo(-5, 0, -1, -1, -0.25, 1);
		base.lineTo(-0.25, -1.5);
		base.lineTo(-0.5, -2);
		base.lineTo(0, -2);

		var material = new THREE.MeshLambertMaterial({color: new THREE.Color('blue')});

		var config = {depth: 1, bevelEnabled: true, bevelSegments: 5, steps: 3, bevelSize: .5, bevelThickness: .25};

		var geometria = new THREE.ExtrudeGeometry(base, config);
		this.trebol = new THREE.Mesh(geometria, material);
		this.add(this.trebol);
	}

	createGUI(gui, titleGui) {
	}

	update() {
	}
}

export { MyAce };
