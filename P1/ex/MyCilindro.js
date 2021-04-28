import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyCilindro extends THREE.Object3D {
	constructor(gui, titleGUI) {
		super();

		this.createGUI(gui, titleGUI);

		/*this.points = [
			new THREE.Vector3(0, 1, 4),
			new THREE.Vector3(4, 1, 0),
			new THREE.Vector3(0, 1, -4),
			new THREE.Vector3(-4, 1, 0),
		];

		this.curva = new THREE.CatmullRomCurve3(this.points, true);*/

		this.curva = new THREE.EllipseCurve(0, 0, 4, 4, 0, 2*Math.PI, true);

		var cilindroGeo = new THREE.CylinderBufferGeometry(3, 3, 3, 30);
		var esferaGeo = new THREE.SphereBufferGeometry(1, 30, 30);
		var material = new THREE.MeshNormalMaterial({opacity: 0.5, transparent: true});
		this.cilindro = new THREE.Mesh(cilindroGeo, material);
		this.esfera = new THREE.Mesh(esferaGeo, material);

		this.add(this.cilindro);
		this.add(this.esfera);

		this.position.y += 1.5;
		this.extension = 0;
	}

	createGUI(gui, titleGUI) {
		this.guiControls = new function () {
			this.extension = 0;
		}

		var folder = gui.addFolder(titleGUI);

		folder.add(this.guiControls, 'extension', 0.0, 30.0, 0.2).name('Extensión : ');
	}

	update() {
		if(this.guiControls.extension != this.extension){
			this.extension = this.guiControls.extension;

			this.curva = new THREE.EllipseCurve(0, 0, 4, 4+this.extension, 0, 2*Math.PI, true, Math.PI/2);

			this.cilindro.scale.x = 1 + this.extension/3;
		}

		var time = Date.now();
		var looptime = 2000;
		var t = (time%looptime)/looptime;
		
		var pos2d = this.curva.getPointAt(t);
		var posicion = new THREE.Vector3(pos2d.x, pos2d.y, 0).applyAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2);
		this.esfera.position.copy(posicion);
	}
}

export { MyCilindro };
