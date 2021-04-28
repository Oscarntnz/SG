import * as THREE from '../libs/three.module.js'

class MyPendulo extends THREE.Object3D {
	constructor(gui) {
		super();

		this.parteG = new THREE.Object3D();
		this.parteP = new THREE.Object3D();

		this.parteG.nodoGrande = this.createParteGrande();
		this.parteP.nodoPequeno = this.createPartePequena();

		this.parteG.add(this.parteG.nodoGrande);
		this.parteP.add(this.parteP.nodoPequeno)

		this.parteP.nodoPequeno.position.z = 0.75;
		this.parteP.position.y = -2.5;

		this.add(this.parteG);
		this.add(this.parteP);

		this.createGUI(gui);
	}

	createParteGrande() {
		var parteGrande = new THREE.Object3D();
		parteGrande.longitudCentral = 5;
		var parteEstaticaSup = new THREE.BoxGeometry(2, 4, 1);
		var parteEstaticaInf = new THREE.BoxGeometry(2, 4, 1);
		var parteCentral = new THREE.BoxGeometry(2, parteGrande.longitudCentral, 1);
		var eje = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 30);

		var matEstaticas = new THREE.MeshStandardMaterial({color: new THREE.Color('green')});
		var matDinamica = new THREE.MeshStandardMaterial({color: new THREE.Color('red')});
		var matEje = new THREE.MeshStandardMaterial({color: new THREE.Color('white')});
        
		parteGrande.estaticaSup = new THREE.Mesh(parteEstaticaSup, matEstaticas);
		parteGrande.parteCentral = new THREE.Mesh(parteCentral, matDinamica);
		parteGrande.estaticaInf = new THREE.Mesh(parteEstaticaInf, matEstaticas);
		parteGrande.eje = new THREE.Mesh(eje, matEje);

		parteGrande.add(parteGrande.estaticaSup);
		parteGrande.add(parteGrande.parteCentral);
		parteGrande.add(parteGrande.estaticaInf);
		parteGrande.add(parteGrande.eje);

		parteGrande.estaticaSup.position.y = parteGrande.longitudCentral/2 + 2;
		parteGrande.estaticaInf.position.y = -parteGrande.longitudCentral/2 - 2;
		parteGrande.position.y = -parteGrande.longitudCentral/2 - 2;
		parteGrande.eje.rotation.x = 90*Math.PI/180;
		parteGrande.eje.position.y = 4.5;
		parteGrande.eje.position.z = 0.5;

		return parteGrande;
	}

	createPartePequena() {
		var partePequena = new THREE.Object3D();
		partePequena.longitud = 10;
		var pendulo = new THREE.BoxGeometry(1.5, partePequena.longitud, 0.5);
		var eje = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 30);

		var matEstaticas = new THREE.MeshStandardMaterial({color: new THREE.Color('blue')});
		var matEje = new THREE.MeshStandardMaterial({color: new THREE.Color('black')});
        
		partePequena.pendulo = new THREE.Mesh(pendulo, matEstaticas);
		partePequena.eje = new THREE.Mesh(eje, matEje);

		partePequena.add(partePequena.pendulo);
		partePequena.add(partePequena.eje);

		partePequena.position.y = -partePequena.longitud/2 + 1;
		partePequena.eje.rotation.x = 90*Math.PI/180;
		partePequena.eje.position.y = 4;
		partePequena.eje.position.z = 0.25;

		return partePequena;
	}

	createGUI(gui) {
		var that = this;

		this.controlesGrande = new function() {
			this.longitud = that.parteG.nodoGrande.longitudCentral;
			this.giro = 0;
		}

		this.controlesPequeno = new function() {
			this.longitud = that.parteG.nodoGrande.longitudCentral;
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

	update() {
		var escala = this.controlesGrande.longitud/this.parteG.nodoGrande.longitudCentral;
		var rotacion = this.controlesGrande.giro;

		// Escala parte grande

		this.parteG.nodoGrande.parteCentral.scale.y = escala;

		this.parteG.nodoGrande.parteCentral.position.y = -this.parteG.nodoGrande.longitudCentral/2*escala 
		+ this.parteG.nodoGrande.longitudCentral/2;

		this.parteG.nodoGrande.estaticaInf.position.y = this.parteG.nodoGrande.parteCentral.position.y 
		-this.parteG.nodoGrande.longitudCentral*escala/2 - 2;

		// Rotacion parte grande

		this.rotation.z = rotacion;

		var escalaP = this.controlesPequeno.longitud/this.parteG.nodoGrande.longitudCentral;
		var rotacionP = this.controlesPequeno.giro;
		var posicionP = this.controlesPequeno.posicion;

		// Escala parte grande

		this.parteP.nodoPequeno.pendulo.scale.y = escalaP;
		this.parteP.nodoPequeno.pendulo.position.y = -this.parteP.nodoPequeno.longitud/2*escalaP + this.parteP.nodoPequeno.longitud/2;

		// Rotacion parte grande

		this.parteP.rotation.z = rotacionP;

		// Traslacion parte grande

		this.parteP.position.y = -this.parteG.nodoGrande.longitudCentral/2 + 0.5 
		- escala*this.parteP.nodoPequeno.longitud/2*posicionP/100;
	}
}

export { MyPendulo };