import * as THREE from '../libs/three.module.js'

class MyBarrido extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

		this.createGUI(gui, titleGui);

		var base = new THREE.Shape();

		base.moveTo(0, -3.5);
		base.bezierCurveTo(2, -2.5, 5, 2.5, 2, 3.5);
		base.bezierCurveTo(0, 3.5, 0, 2.5, 0, 1.5);
		base.bezierCurveTo(0, 2.5, 0, 3.5, -2, 3.5);
		base.bezierCurveTo(-5, 2.5, -2, -2.5, 0, -3.5);

		var trayectoria = new THREE.CatmullRomCurve3([
			new THREE.Vector3(0, -10, 0),
			new THREE.Vector3(2.5, -5, 0),
			new THREE.Vector3(0, 0, -5),
			new THREE.Vector3(-2.5, 5, 0),
			new THREE.Vector3(0, 10, 0)
		]);

		var material = new THREE.MeshPhongMaterial({color: new THREE.Color('green')});

		var config = {curveSegments: 50, steps: 50, bevelOffset: 50, extrudePath: trayectoria};

		var geometria = new THREE.ExtrudeBufferGeometry(base, config);
		this.barrido = new THREE.Mesh(geometria, material);
		this.add(this.barrido);
	}

	createGUI(gui, titleGui) {
	}

	update() {
	}
}

export { MyBarrido };
