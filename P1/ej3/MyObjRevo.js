import * as THREE from '../libs/three.module.js'

class MyObjRevo extends THREE.Object3D {
	constructor(gui, titleGui, numRevo, resModif = false, anguloModif = false) {
		super();

		this.resModif = resModif;
		this.anguloModif = anguloModif;
		this.resolucion = numRevo;
		this.angulo = 2 * Math.PI;

		this.createGUI(gui, titleGui, this.resolucion);

		this.points = [];

		this.points.push(new THREE.Vector3(0.0, -1.4, 0.0));
		this.points.push(new THREE.Vector3(1.0, -1.4, 0.0));
		this.points.push(new THREE.Vector3(1.0, -1.1, 0.0));
		this.points.push(new THREE.Vector3(0.5, -0.7, 0.0));
		this.points.push(new THREE.Vector3(0.4, -0.4, 0.0));
		this.points.push(new THREE.Vector3(0.4, 0.5, 0.0));
		this.points.push(new THREE.Vector3(0.5, 0.6, 0.0));
		this.points.push(new THREE.Vector3(0.3, 0.6, 0.0));
		this.points.push(new THREE.Vector3(0.5, 0.8, 0.0));
		this.points.push(new THREE.Vector3(0.55, 1.0, 0.0));
		this.points.push(new THREE.Vector3(0.5, 1.2, 0.0));
		this.points.push(new THREE.Vector3(0.3, 1.4, 0.0));
		this.points.push(new THREE.Vector3(0.0, 1.5, 0.0));

		this.revoMat = new THREE.MeshNormalMaterial();

		if (this.resolucion > 1) {
			var revoGeom = new THREE.LatheBufferGeometry(this.points, this.resolucion);
			this.revo = new THREE.Mesh(revoGeom, this.revoMat);
			this.add(this.revo);
			this.revo.position.y = 1.4;
		}

		var lineGeometry = new THREE.BufferGeometry().setFromPoints(this.points);
		var line = new THREE.Line(lineGeometry, this.revoMat);
		this.add(line);
		line.position.y = 1.4;
	}

	createGUI(gui, titleGui) {
		let rev = this.resolucion;

		this.guiControls = new function () {
			this.resolucion = rev;
			this.angulo = 2.0 * Math.PI;
		}

		if(this.resModif || this.anguloModif){
			var folder = gui.addFolder(titleGui);

			if(this.resModif)
				folder.add(this.guiControls, 'resolucion', 1.0, 30.0, 1.0).name('Resolucion : ').listen();
			if(this.anguloModif)
				folder.add(this.guiControls, 'angulo', 0.1, 2.0 * Math.PI, 0.1).name('Angulo : ').listen();
		}
	}

	update() {
		if(this.resolucion != this.guiControls.resolucion || this.angulo != this.guiControls.angulo) {
			this.remove(this.revo);

			this.resolucion = this.guiControls.resolucion;
			this.angulo = this.guiControls.angulo;

			if(this.resolucion > 1){
				var revoGeom = new THREE.LatheBufferGeometry(this.points, this.resolucion, 0, this.angulo);
				this.revo = new THREE.Mesh(revoGeom, this.revoMat);
				this.add(this.revo);
				this.revo.position.y = 1.4;
			}
		}
	}
}

export { MyObjRevo };
