import * as THREE from '../libs/three.module.js'

class MyHeart extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		this.createGUI(gui, titleGui);

		var base = new THREE.Shape();

		base.moveTo(0, -3.5);
		base.bezierCurveTo(2, -2.5, 5, 2.5, 2, 3.5);
		base.bezierCurveTo(0, 3.5, 0, 2.5, 0, 1.5);
		base.bezierCurveTo(0, 2.5, 0, 3.5, -2, 3.5);
		base.bezierCurveTo(-5, 2.5, -2, -2.5, 0, -3.5);

		var material = new THREE.MeshLambertMaterial({color: new THREE.Color('red')});

		var config = {depth: 1, bevelEnabled: true, bevelSegments: 5, steps: 3, bevelSize: .5, bevelThickness: .25};

		var geometria = new THREE.ExtrudeBufferGeometry(base, config);
		this.corazon = new THREE.Mesh(geometria, material);
		this.add(this.corazon);
	}

	createGUI(gui, titleGui) {
	}

	update() {
	}
}

export { MyHeart };
