import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyBolaSaltarina extends THREE.Object3D {
	constructor(gui, titleGUI) {
		super();

		this.createGUI(gui, titleGUI);
		this.alturaCilindro = 10;

		this.curva = new THREE.EllipseCurve(0, 0, 4, 4, 0, 2*Math.PI, true);

		var cilindroGeo = new THREE.CylinderBufferGeometry(1, 1, this.alturaCilindro, 30);
		var esferaGeo = new THREE.SphereBufferGeometry(1, 30, 30);
		var material = new THREE.MeshNormalMaterial({opacity: 0.5, transparent: true});
        material.side = THREE.DoubleSide;
		this.cilindro = new THREE.Mesh(cilindroGeo, material);
		this.esfera = new THREE.Mesh(esferaGeo, material);

		this.add(this.cilindro);
		this.add(this.esfera);

		this.extension = 0;

		this.position.y = this.alturaCilindro/2;
		this.esfera.ascendente = true;

		this.createAnimation();
	}

	createGUI(gui, titleGUI) {
		this.guiControls = new function () {
			this.radio = 10.0;
		}

		var folder = gui.addFolder(titleGUI);

		folder.add(this.guiControls, 'radio', 1.0, 30.0, 0.2).name('Radio : ');
	}

	createAnimation(){
		this.movimiento = new TWEEN.Tween({y: this.alturaCilindro/2 - 1.0}).to({y: -this.alturaCilindro/2 + 1.0}, 500);
		this.movimiento.easing(TWEEN.Easing.Sinusoidal.InOut).yoyo(true).repeat(Infinity);

		var that = this;
		this.movimiento.onUpdate(function (object) {
			that.esfera.position.y = object.y;
		});
	}

	update() {
		if(!this.movimiento.isPlaying())
			this.movimiento.start();

		if(this.guiControls.radio != this.radio){
			this.radio = this.guiControls.radio/2;

			this.curva = new THREE.EllipseCurve(0, 0, this.radio+1, this.radio+1, 0, 2*Math.PI, true, Math.PI/2);

			this.cilindro.scale.x = this.radio;
			this.cilindro.scale.z = this.radio;
		}

		var time = Date.now();
		var looptime = 5000;
		var t = (time%looptime)/looptime;
		
		var pos2d = this.curva.getPointAt(t);
		var posicion = new THREE.Vector3(pos2d.x, pos2d.y, 0).applyAxisAngle(new THREE.Vector3(1,0,0), Math.PI/2);
		posicion.y = this.esfera.position.y + (this.esfera.ascendente? 0.02 : -0.02);
		this.esfera.position.copy(posicion);
	}
}

export { MyBolaSaltarina };
