import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

class MyNave extends THREE.Object3D {
	constructor() {
		super();

		var naveGeo = new THREE.TetrahedronGeometry();
		naveGeo.rotateY(-Math.PI/4);
		naveGeo.rotateX(Math.PI/4);
		naveGeo.scale(1, 3, 1);
		naveGeo.rotateY(Math.PI);
		naveGeo.rotateX(Math.PI/2);

		var texture = new THREE.TextureLoader().load('../imgs/textura-ajedrezada.jpg');
		var naveMat = new THREE.MeshPhongMaterial({ map: texture });

		this.nave = new THREE.Mesh(naveGeo, naveMat);

		this.add(this.nave);

		// Crear los puntos de la trayectoria
        
        /*this.points = [
			new THREE.Vector3(0, 0, 0),		// inicio curva derecha
			new THREE.Vector3(10, -3, 5),
			new THREE.Vector3(20, -5, 0),
			new THREE.Vector3(5, 3, -5),
			new THREE.Vector3(0, 3, 0),		// inicio curva izquierda
			new THREE.Vector3(-15, -2, 5),
			new THREE.Vector3(-30, 3, 0),
			new THREE.Vector3(-15, 2, -5),
		];*/
        
		this.points = [
			new THREE.Vector3(0, 0, 0),		// inicio curva derecha
			new THREE.Vector3(10, -3, 5),
			new THREE.Vector3(20, -5, 0),
			new THREE.Vector3(5, 3, -5),
			new THREE.Vector3(0, 3, 0),
		];
        
        this.points2 = [
            new THREE.Vector3(0, 3, 0),		// inicio curva izquierda
			new THREE.Vector3(-15, -2, 5),
			new THREE.Vector3(-30, 3, 0),
			new THREE.Vector3(-15, 2, -5),
			new THREE.Vector3(0, 0, 0)
        ];

		this.curva = new THREE.CatmullRomCurve3(this.points, false);
        this.curva2 = new THREE.CatmullRomCurve3(this.points2, false);

		const points = this.curva.getPoints(100);
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const points2 = this.curva2.getPoints(100);
		const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);

		const material = new THREE.LineBasicMaterial( { color : 'red' } );

		this.spline = new THREE.Line( geometry, material );
        this.spline2 = new THREE.Line( geometry2, material );

		this.add(this.spline);
        this.add(this.spline2);

		this.createAnimation();
	}

	/*createAnimation() {
		var origen = {x:0, y:2, z:0, old:{x:0, y:2, z:0}};
		var tiempo1 = 4000;
		var destinoX = [];
		var destinoY = [];
		var destinoZ = [];

		for(let i = 1; i <= this.points.length/2; i++) {
			destinoX.push(this.points[i].x);
			destinoY.push(this.points[i].y);
			destinoZ.push(this.points[i].z);
		};
		
		this.movimiento = new TWEEN.Tween(origen).to({x: destinoX, y: destinoY, z: destinoZ}, tiempo1);
		this.movimiento.easing(TWEEN.Easing.Sinusoidal.InOut).interpolation(TWEEN.Interpolation.CatmullRom).delay(0);

		var that = this;
		var porcentajeRecorrido = 0;
		var posOri = new THREE.Vector3(0, 0, 0);
		var posDest = new THREE.Vector3(0, 0, 0);
		this.movimiento.onUpdate(function (object) {
			posOri.set(object.x, object.y, object.z);
			posDest.set(object.old.x, object.old.y, object.old.z);

			that.nave.position.copy(posDest);

			let diferencia = posOri.distanceTo(posDest);
			porcentajeRecorrido += diferencia/that.curva.getLength();

			let pos = new THREE.Vector3(object.x, object.y, object.z);
			pos.add(that.curva.getTangentAt(porcentajeRecorrido));

			that.nave.lookAt(pos.x, pos.y, pos.z);

			object.old.x = object.x;
			object.old.y = object.y;
			object.old.z = object.z;
		})
		.onStart(() => porcentajeRecorrido = 0);

		var tiempo2 = 8000;
		var destinoX2 = [];
		var destinoY2 = [];
		var destinoZ2 = [];

		for(let i = this.points.length/2+1; i <= this.points.length; i++) {
			destinoX2.push(this.points[i%this.points.length].x);
			destinoY2.push(this.points[i%this.points.length].y);
			destinoZ2.push(this.points[i%this.points.length].z);
		};
		
		this.movimiento2 = new TWEEN.Tween(origen).to({x: destinoX2, y: destinoY2, z: destinoZ2}, tiempo2);
		this.movimiento2.easing(TWEEN.Easing.Sinusoidal.InOut).interpolation(TWEEN.Interpolation.CatmullRom).delay(0);

		this.movimiento2.onUpdate(function (object) {
			posOri.set(object.x, object.y, object.z);
			posDest.set(object.old.x, object.old.y, object.old.z);

			that.nave.position.copy(posDest);

			let diferencia = posOri.distanceTo(posDest);
			porcentajeRecorrido += diferencia/that.curva.getLength();
			porcentajeRecorrido - 1.0 >= 0.0 ? porcentajeRecorrido = 1.0 : null;

			let pos = new THREE.Vector3(object.x, object.y, object.z);
			pos.add(that.curva.getTangentAt(porcentajeRecorrido));

			that.nave.lookAt(pos.x, pos.y, pos.z);

			object.old.x = object.x;
			object.old.y = object.y;
			object.old.z = object.z;
		});

		this.movimiento.chain(this.movimiento2);
		this.movimiento2.chain(this.movimiento);
	}*/
    
    createAnimation() {
		var origen = {x:0};
		var tiempo1 = 4000;
		
		this.movimiento = new TWEEN.Tween(origen).to({x: 1.0}, tiempo1);
		this.movimiento.easing(TWEEN.Easing.Sinusoidal.InOut).interpolation(TWEEN.Interpolation.CatmullRom);

		var that = this;
		this.movimiento.onUpdate(function (object) {
			var posicion = that.curva.getPointAt(object.x);
            that.nave.position.copy(posicion);
            var tangente = that.curva.getTangentAt(object.x);
            posicion.add(tangente);
            that.nave.lookAt(posicion);
		})
		.onStart(() =>  origen = {x:0});

        var origen2 = {x:0};
		var tiempo2 = 8000;
		
		this.movimiento2 = new TWEEN.Tween(origen2).to({x: 1.0}, tiempo2);
		this.movimiento2.easing(TWEEN.Easing.Sinusoidal.InOut).interpolation(TWEEN.Interpolation.CatmullRom);

		this.movimiento2.onUpdate(function (object) {
			var posicion = that.curva2.getPointAt(object.x);
            that.nave.position.copy(posicion);
            var tangente = that.curva2.getTangentAt(object.x);
            posicion.add(tangente);
            that.nave.lookAt(posicion);
		})
        .onStart(() =>  origen2 = {x:0});

		this.movimiento.chain(this.movimiento2);
		this.movimiento2.chain(this.movimiento);
	}

	update() {
		if(!this.movimiento.isPlaying() && !this.movimiento2.isPlaying())
			this.movimiento.start();
		/*var time = Date.now();
		var looptime = 20000;
		var t = (time%looptime)/looptime;
		
		var posicion = this.curva.getPointAt(t);
		this.nave.position.copy(posicion);
		var tangente = this.curva.getTangentAt(t);
		posicion.add(tangente);
		this.nave.lookAt(posicion);*/
	}
}

export { MyNave };
