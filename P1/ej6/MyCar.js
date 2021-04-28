import * as THREE from '../libs/three.module.js'
import * as OBJLoader from '../libs/OBJLoader.js'
import * as MTLLoader from '../libs/MTLLoader.js'

class MyCar extends THREE.Object3D {
	constructor(gui, titleGui) {
		super();

        var loader = new OBJLoader.OBJLoader();
		var materialLoader = new MTLLoader.MTLLoader();
		var that = this;

		materialLoader.load("../models/porsche911/911.mtl",
			function (mat) {
				loader.setMaterials(mat);

				loader.load("../models/porsche911/Porsche_911_GT2.obj",
				function (car) {
					that.add(car);
					car.rotation.y = 180/360*2*Math.PI;
					car.position.y += 0.58;
				}
				);
			}
		);
	}

	createGUI(gui, titleGui) {
	}

	update() {
		this.rotation.set(this.rotation.x, this.rotation.y + 0.015, this.rotation.z);
	}
}

export { MyCar };
