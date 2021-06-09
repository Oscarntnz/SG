// Alumno: Antunez Martinaitis, Oscar

// Clases de la biblioteca

import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import {GUI} from '../libs/dat.gui.module.js'
import {TrackballControls} from '../libs/TrackballControls.js'

// Clases de mi proyecto

import {Partida} from './Partida.js'
import {Menu} from './Menu.js'

class Falling extends THREE.Scene {
	static COLORFONDO = 0x111111;
	static debug = true;

	constructor(myCanvas) {
		super();

		this.renderer = this.createRenderer(myCanvas);
		
		this.createLights();

		this.createCamera();

		this.menuPrincipal = new Menu(new THREE.Vector3(0,0,0));
		this.add(this.menuPrincipal);

		this.botones = [];
		this.menuPrincipal.getBotones().forEach((b) => {
			this.botones.push(b);
		});

		this.botonSeleccionado = null;
	}

	createCamera() {
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
		
		this.camera.position.set(0, 0, 50);
		
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
		if(this.partida !== null && this.partida !== undefined)
			this.partida.procesarBoton(e);
	}

	onMouseMove(e) {
		if(this.botones.length > 0){	
			let mouse = new THREE.Vector2();
			mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
			mouse.y = 1 - 2 * (e.clientY / window.innerHeight);

			let raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse , this.camera);

			let objSeleccionados = raycaster.intersectObjects(this.botones, true);

			if(objSeleccionados.length > 0) {
				let objSeleccionado = objSeleccionados[0].object.userData.parent;
				objSeleccionado.cambiarSeleccion(true);

				this.botonSeleccionado = objSeleccionado;
			}
			else {
				this.botones.forEach((b) => b.cambiarSeleccion(false));
				this.botonSeleccionado = null;
			}
		}
	}

	onMouseClick(e) {
		if(this.botonSeleccionado !== null && this.botonSeleccionado !== undefined) {
			let dificultad = this.botonSeleccionado.nombre;
			this.quitarMenu();
			this.comenzarJuego(dificultad);
		}
	}

	quitarMenu() {
		this.remove(this.menuPrincipal);

		this.botones = [];
		this.botonSeleccionado = null;
	}

	comenzarJuego(dificultad) {
		this.partida = new Partida(dificultad);
		this.add(this.partida);
		this.partida.iniciarPartida();

		this.camera.position.set(0, 0, 
			2 * this.partida.tablero.filas + this.partida.tablero.columnas * 2);
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
	window.addEventListener("mousemove", (e) => scene.onMouseMove(e));
	window.addEventListener("click", (e) => scene.onMouseClick(e));

	scene.update();
});
