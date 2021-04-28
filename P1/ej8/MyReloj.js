import * as THREE from '../libs/three.module.js'

class MyReloj extends THREE.Object3D {
	constructor(gui) {
		super();

		this.createGUI(gui);

		var marcasGeometria = this.crearMarcas();
		this.marcas = [];
		var materialMarca = new THREE.MeshPhongMaterial({color: 'green'});

		marcasGeometria.forEach(marca => {
			this.marcas.push(new THREE.Mesh(marca, materialMarca));
		});

		this.marcas.forEach(marca => {
			this.add(marca);
		});

		var agujaGeometria = new THREE.SphereGeometry(1, 20, 30);
		var materialMarca = new THREE.MeshPhongMaterial({color: 'red', shininess: 180});

		agujaGeometria.translate(0, 0, -6);

		this.aguja = new THREE.Mesh(agujaGeometria, materialMarca);

		this.add(this.aguja);

		this.tiempoAnterior = Date.now();
	}

	crearMarcas() {
		let marcasGeometria = [];
		let posIni = new THREE.Vector3(0, 0, -8);

		for(let i = 0; i < 12; i++){
			let angulo = i*2*Math.PI/12;
			let x, y, z;

			x = posIni.x*Math.cos(angulo) + posIni.z*Math.sin(angulo);
      		y = posIni.y;
      		z = posIni.z*Math.cos(angulo) - posIni.x*Math.sin(angulo);

			marcasGeometria.push(new THREE.SphereGeometry(1, 20, 30));
			marcasGeometria[marcasGeometria.length-1].translate(x, y, z);
		}

		return marcasGeometria;
	}

	createGUI(gui) {
		this.controlesReloj = new function() {
			this.velocidad = 1.0;
			this.activado = true;
		}

		var folderReloj = gui.addFolder("Reloj");

		folderReloj.add(this.controlesReloj, 'velocidad', -12, 12, 0.5).name ('Velocidad : ');
		folderReloj.add(this.controlesReloj, 'activado').name ('Animación : ');
	}

	update() {
		const angulo = 2*Math.PI/12
		var tiempoActual = Date.now();

		var segundosTranscurridos = (tiempoActual - this.tiempoAnterior)/1000.0;

		if(this.controlesReloj.activado){
			this.aguja.rotation.y -= angulo * this.controlesReloj.velocidad * segundosTranscurridos;
		}

		this.tiempoAnterior = tiempoActual;
	}
}

export { MyReloj };