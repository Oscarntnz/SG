// Alumno: Antunez Martinaitis, Oscar

import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import * as ThreeBSP from '../libs/ThreeBSP.js'

class MyComeCocos extends THREE.Object3D {
	constructor() {
		super();

		this.createPacman();

		this.createLine();

		this.createAnimation();

	}

	createPacman() {
		var superior = new THREE.SphereGeometry(2, 20, 20);
		var inferior = superior.clone();
		var ojo1 = new THREE.CylinderGeometry(0.3, 0.3, 4);
		var caja = new THREE.BoxGeometry(4, 4, 4);

		caja.translate(0, -2, 0);

		ojo1.rotateZ(Math.PI/2);
		ojo1.translate(0, 1, 1);

		var superiorBSP = new ThreeBSP.ThreeBSP(superior);
		var inferiorBSP = new ThreeBSP.ThreeBSP(inferior);
		var ojo1BSP = new ThreeBSP.ThreeBSP(ojo1);
		var cajaBSP = new ThreeBSP.ThreeBSP(caja);

		superiorBSP = superiorBSP.subtract(cajaBSP);
		superiorBSP = superiorBSP.subtract(ojo1BSP);

		inferiorBSP = inferiorBSP.subtract(cajaBSP);

		var superiorFinal = superiorBSP.toGeometry();
		var inferiorFinal = inferiorBSP.toGeometry();

        var material = new THREE.MeshStandardMaterial({color: 0xFFFF00});
        var geoFinalS = new THREE.BufferGeometry().fromGeometry(superiorFinal);
		var geoFinalI = new THREE.BufferGeometry().fromGeometry(inferiorFinal);
		geoFinalI.rotateX(Math.PI);

		this.finalS = new THREE.Mesh(geoFinalS, material);
		this.finalI = new THREE.Mesh(geoFinalI, material);
		

		this.finalI.position.z = 2;
		this.nodoInferior = new THREE.Group();
		this.nodoInferior.add(this.finalI);
		this.nodoInferior.position.z = -2;

		this.pacman = new THREE.Group().add(this.finalS, this.nodoInferior);

		this.ascendente = true;

		this.add(this.pacman);
	}

	createLine() {
		this.points = [
			new THREE.Vector3(0, 5, 10),
			new THREE.Vector3(0, 5, -10),
			new THREE.Vector3(10, 5, -5),
			new THREE.Vector3(3, 5, 0),
			new THREE.Vector3(3, 5, 10),
		];

		this.curva = new THREE.CatmullRomCurve3(this.points, true);

		var points = this.curva.getPoints(100);

		var geo1 = new THREE.BufferGeometry().setFromPoints(points);

		var material = new THREE.LineBasicMaterial({color : 0xFF0000});

		this.spline = new THREE.Line(geo1, material);

		this.add(this.spline);
	}

	createAnimation() {
		var origen = {x:0};
		var tiempo1 = 6000;
		
		this.movimiento = new TWEEN.Tween(origen).to({x: 0.4}, tiempo1);
		this.movimiento.easing(TWEEN.Easing.Sinusoidal.InOut).interpolation(TWEEN.Interpolation.CatmullRom);

		var that = this;
		this.movimiento.onUpdate(function (object) {
			var posicion = that.curva.getPointAt(object.x);
            that.pacman.position.copy(posicion);
            var tangente = that.curva.getTangentAt(object.x);
            posicion.add(tangente);
            that.pacman.lookAt(posicion);
		})
		.onStart(() =>  origen = {x:0});

		var tiempo2 = 4000;
		
		this.movimiento2 = new TWEEN.Tween(origen).to({x: 1.0}, tiempo2);
		this.movimiento2.easing(TWEEN.Easing.Sinusoidal.InOut).interpolation(TWEEN.Interpolation.CatmullRom);

		this.movimiento2.onUpdate(function (object) {
			var posicion = that.curva.getPointAt(object.x);
            that.pacman.position.copy(posicion);
            var tangente = that.curva.getTangentAt(object.x);
            posicion.add(tangente);
            that.pacman.lookAt(posicion);
		});

		this.movimiento.chain(this.movimiento2);
		this.movimiento2.chain(this.movimiento);
	}

	update() {
		if(!this.movimiento.isPlaying() && !this.movimiento2.isPlaying())
			this.movimiento.start();

		if(!this.ascendente && this.nodoInferior.rotation.x <= 0)
			this.ascendente = true;
		else if(this.ascendente && this.nodoInferior.rotation.x >= Math.PI/4)
			this.ascendente = false;

		this.nodoInferior.rotation.x = this.nodoInferior.rotation.x + (this.ascendente? 0.05: -0.05);
	}
}

export { MyComeCocos };
