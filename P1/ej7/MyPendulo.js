import * as THREE from '../libs/three.module.js'

class MyPendulo extends THREE.Object3D {
	constructor(gui) {
		super();

		this.nodoG = this.createParteGrande();

		this.add(this.nodoG);

		this.createGUI(gui);
	}

	createParteGrande() {
		var nodo = new THREE.Group();
		var longitudCentral = 5;
		var superior = new THREE.BoxBufferGeometry(2, 4, 1);
		var central = new THREE.BoxBufferGeometry(2, longitudCentral, 1);
		var inferior = new THREE.BoxBufferGeometry(2, 4, 1);
		var eje = new THREE.CylinderBufferGeometry(0.5, 0.5, 0.25, 30);
        
		nodo.superior = new THREE.Mesh(superior, new THREE.MeshStandardMaterial({color: new THREE.Color('green')}));
		nodo.central = new THREE.Mesh(central, new THREE.MeshStandardMaterial({color: new THREE.Color('red')}));
		nodo.inferior = new THREE.Mesh(inferior, new THREE.MeshStandardMaterial({color: new THREE.Color('green')}));
		nodo.eje = new THREE.Mesh(eje, new THREE.MeshStandardMaterial({color: new THREE.Color('white')}));
		nodo.pequeno = this.createPartePequena();
		nodo.nodoP = new THREE.Group().add(nodo.pequeno);

		nodo.central.longitud = longitudCentral;

		nodo.add(nodo.superior);
		nodo.add(nodo.central);
		nodo.add(nodo.inferior);
		nodo.add(nodo.eje);
		nodo.add(nodo.nodoP);

		nodo.superior.position.y = longitudCentral/2 + 2;
		nodo.inferior.position.y = -longitudCentral/2 - 2;
		nodo.position.y = -longitudCentral/2 - 2;
		nodo.eje.rotation.x = 90*Math.PI/180;
		nodo.eje.position.y = 4.5;
		nodo.eje.position.z = 0.5;
		nodo.nodoP.position.y = longitudCentral/2 - 1; 
		nodo.nodoP.position.z = 0.5 + 0.25; 

		return nodo;
	}

	createPartePequena() {
		var nodo = new THREE.Group();
		var longitud = 10;
		var pendulo = new THREE.BoxBufferGeometry(1.5, longitud, 0.5);
		var eje = new THREE.CylinderBufferGeometry(0.5, 0.5, 0.25, 30);

		nodo.pendulo = new THREE.Mesh(pendulo, new THREE.MeshStandardMaterial({color: new THREE.Color('blue')}));
		nodo.eje = new THREE.Mesh(eje, new THREE.MeshStandardMaterial({color: new THREE.Color('black')}));

		nodo.longitud = longitud;

		nodo.add(nodo.pendulo);
		nodo.add(nodo.eje);

		nodo.position.y = -nodo.longitud/2 + 1;
		nodo.eje.rotation.x = 90*Math.PI/180;
		nodo.eje.position.y = 4;
		nodo.eje.position.z = 0.25;

		return nodo;
	}

	createGUI(gui) {
		var that = this;

		this.controlesGrande = new function() {
			this.longitud = that.nodoG.central.longitud;
			this.giro = 0;
		}

		this.controlesPequeno = new function() {
			this.longitud = that.nodoG.central.longitud;
			this.giro = 0;
			this.posicion = 10;
		}

		var folderPenduloGrande = gui.addFolder("Péndulo Grande");
		var folderPenduloPequeno = gui.addFolder("Péndulo Pequeño");

		folderPenduloGrande.add(this.controlesGrande, 'longitud', 5, 10, 0.2).name ('Longitud : ');
		folderPenduloGrande.add(this.controlesGrande, 'giro', -Math.PI/4, Math.PI/4, 0.01).name ('Giro : ');

		folderPenduloPequeno.add(this.controlesPequeno, 'longitud', 5, 10, 0.2).name ('Longitud : ');
		folderPenduloPequeno.add(this.controlesPequeno, 'giro', -Math.PI/4, Math.PI/4, 0.01).name ('Giro : ');
		folderPenduloPequeno.add(this.controlesPequeno, 'posicion', 10, 90, 0.5).name ('Posición (%): ');
	}

	escalaGrande(escala) {
		this.nodoG.central.scale.y = escala;

		this.nodoG.central.position.y = -this.nodoG.central.longitud/2*escala 
		+ this.nodoG.central.longitud/2;

		this.nodoG.inferior.position.y = this.nodoG.central.position.y 
		-this.nodoG.central.longitud*escala/2 - 2;
	}

	escalaPequena(escala) {
		this.nodoG.pequeno.pendulo.scale.y = escala;
		this.nodoG.pequeno.pendulo.position.y = -this.nodoG.pequeno.longitud/2*escala + this.nodoG.pequeno.longitud/2;
	}

	trasladaPequeno(posicion, escala) {
		this.nodoG.nodoP.position.y = this.nodoG.central.longitud/2 -
		escala*this.nodoG.pequeno.longitud/2*posicion/100;
	}

	update() {
		var escala = this.controlesGrande.longitud/this.nodoG.central.longitud;
		var rotacion = this.controlesGrande.giro;

		// Escala parte grande

		this.escalaGrande(escala);

		// Rotacion parte grande

		this.rotation.z = rotacion;

		var escalaP = this.controlesPequeno.longitud/this.nodoG.central.longitud;
		var rotacionP = this.controlesPequeno.giro;
		var posicionP = this.controlesPequeno.posicion;

		// Escala parte grande

		this.escalaPequena(escalaP);		

		// Rotacion parte grande

		this.nodoG.nodoP.rotation.z = rotacionP;

		// Traslacion parte grande

		this.trasladaPequeno(posicionP, escala);
	}
}

export { MyPendulo };