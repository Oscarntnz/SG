// Alumno: Antunez Martinaitis, Oscar

// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import {GUI} from '../libs/dat.gui.module.js'
import {TrackballControls} from '../libs/TrackballControls.js'

// Clases de mi proyecto

import {Tablero} from './Tablero.js'
import {Teclas} from './Teclas.js'
import { Bloque } from './Bloque.js'

class Falling extends THREE.Scene {
	static COLORFONDO = 0x111111;
	static debug = true;

	constructor(myCanvas) {
		super();
		this.filas = 20;
		this.columnas = 10;

		this.sceneObj = [];
		this.objPos = [new THREE.Vector3(0.0, 0.0, 0.0), new THREE.Vector3(0.0, 0.0, 0.0)];
		this.sceneAxis = [];

		this.renderer = this.createRenderer(myCanvas);
		
		this.createLights();

		this.createCamera(this.filas, this.columnas);

		this.tablero = new Tablero(this.filas, this.columnas);
		this.sceneObj.push(this.tablero);

		for(let i = 0; i < this.sceneObj.length; i++) {
			this.sceneObj[i].position.set(this.sceneObj[i].position.x + this.objPos[i].x,
				this.sceneObj[i].position.y + this.objPos[i].y, this.sceneObj[i].position.z + this.objPos[i].z);

			this.add(this.sceneObj[i]);
		}

		this.axis = new THREE.AxesHelper(5);
		this.axis.position.set(0, 0, 0);
		this.sceneAxis.push(this.axis);
		this.add(this.axis);

		this.velocidad = 2000;

		this.iniciarAnimacionPiezas();
	}

	createCamera(filas, columnas) {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		
		this.camera.position.set(0, 0, filas*columnas/4);
		
		var look = new THREE.Vector3(0, 0, 0);
		this.camera.lookAt(look);
		this.add(this.camera);

		
		this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);
		
		this.cameraControl.rotateSpeed = 5;
		this.cameraControl.zoomSpeed = -2;
		this.cameraControl.panSpeed = 0.5;
		
		this.cameraControl.target = look;
	}

	createGround() {
		var geometryGround = new THREE.BoxGeometry(50, 0.2, 50);
		
		var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
		var materialGround = new THREE.MeshPhongMaterial({ map: texture });
		var ground = new THREE.Mesh(geometryGround, materialGround);

		ground.position.y = -0.1;

		this.add(ground);
	}

	createGUI() {
		var gui = new GUI();

		return gui;
	}

	createLights() {
		var ambientLight = new THREE.AmbientLight(0xccddee, 0.35);
		
		this.add(ambientLight);

		this.spotLight = new THREE.SpotLight(0xffffff, 1);
		this.spotLight.position.set(60, 60, 40);
		this.add(this.spotLight);

		this.spotLightTrasera = new THREE.SpotLight(0xffffff, 1);
		this.spotLightTrasera.position.set(60, 60, -40);
		this.add(this.spotLightTrasera);
	}

	createRenderer(myCanvas) {
		var renderer = new THREE.WebGLRenderer();

		renderer.setClearColor(new THREE.Color(Falling.COLORFONDO), 1.0);

		renderer.setSize(window.innerWidth, window.innerHeight);

		$(myCanvas).append(renderer.domElement);

		return renderer;
	}

	getCamera() {
		return this.camera;
	}

	setCameraAspect(ratio) {
		this.camera.aspect = ratio;
		
		this.camera.updateProjectionMatrix();
	}

	onWindowResize() {
		this.setCameraAspect(window.innerWidth / window.innerHeight);

		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	onKeyDown(e) {
		let codigo = e.which || e.keyCode;
		let valorCodigo = parseInt(codigo);

		if(valorCodigo >= 37 && valorCodigo <= 40) {
			let flecha = Teclas.FLECHAS[codigo];

			if(flecha == 'I' || flecha == 'D')
				this.tablero.desplazarHorizontalmente(flecha);
			else if(flecha == 'AB')
				this.tablero.bajarPieza();
		}
		else if(valorCodigo == 32){
			let tecla = Teclas.ESPECIALES[codigo];

			if(tecla == 'ESPACIO')
			this.tablero.tumbarPieza();
		}
		else {
			if(String.fromCharCode(codigo).toUpperCase() == 'D')
				this.tablero.rotar();
		}
	}

	iniciarAnimacionPiezas() {
		let pIni = {y : 0}, pFin = {y : 1};
		let that = this;

		this.animacionPiezas = new TWEEN.Tween(pIni).to(pFin, this.velocidad)
		.onRepeat(function() {
			that.tablero.bajarPieza();
		})
		.repeat(Infinity).start();
	}

	acabarAnimacionPiezas(){
		this.animacionPiezas.stop();
	}

	update() {
		if(Falling.debug)
			this.cameraControl.update();

		this.renderer.render(this, this.getCamera());

		requestAnimationFrame(() => this.update())

		TWEEN.update();
	}
}

$(function () {

	var scene = new Falling("#WebGL-output");

	window.addEventListener("resize", () => scene.onWindowResize());
	window.addEventListener("keydown", (e) => scene.onKeyDown(e));

	scene.update();
});
