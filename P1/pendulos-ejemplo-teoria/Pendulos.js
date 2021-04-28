
import * as THREE from '../libs/three.module.js'

class Pendulos extends THREE.Object3D {
  constructor(gui,titleGui) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    this.createGUI(gui,titleGui);

    // El material se hará con una textura ajedrezada
    var cargadorTexturas = new THREE.TextureLoader();
    var textureUp = cargadorTexturas.load('../imgs/textura-ajedrezada.jpg');
    // Las instrucciones de ajuste de texturas ya se explicarán en el tema correspondiente
    textureUp.repeat.set(0.1, 1);
    var materialUp = new THREE.MeshPhongMaterial ({map: textureUp});
    var textureDown = cargadorTexturas.load('../imgs/textura-ajedrezada-amarilla.jpg');
    textureDown.repeat.set(0.1, 1);
    var materialDown = new THREE.MeshPhongMaterial ({map: textureDown});

    // Altura y anchura de las cajas
    this.h = 5.0;
    this.a = 0.5;
    
    // Un Mesh se compone de geometría y material
    var boxGeom = new THREE.BoxGeometry (this.a,this.h,this.a);
    // Esta transformacion es común a ambas piezas y no depende de variables que modifiquen su valor
    // Se aplica la transformación directamente a la geometría antes de crear el Mesh
    boxGeom.translate(0,-this.h/2,0);

    // Ya podemos construir y enlazar los nodos del modelo jerárquico
    this.boxUp = new THREE.Mesh (boxGeom, materialUp);
    this.boxUp.scale.y = this.guiControls.escalaUp;

    this.boxDown =  new THREE.Mesh (boxGeom, materialDown);
    this.boxDown.position.y = -this.h*this.guiControls.escalaUp;
    this.boxDown.rotation.z = this.guiControls.rotacionDown;
    this.boxDown.scale.y = this.guiControls.escalaDown;

    this.rotation.z = this.guiControls.rotacionUp;
    this.add (this.boxUp);
    this.add (this.boxDown);
  }
  
  createGUI (gui,titleGui) {
    // Controles para el tamaño, la orientación y la posición de la caja
    this.guiControls = new function () {
      this.escalaUp = 1.0;
      this.rotacionUp = 0.0;
      this.escalaDown = 1.0;
      this.rotacionDown = 0.0;
      
      // Un botón para dejarlo todo en su posición inicial
      // Cuando se pulse se ejecutará esta función.
      this.reset = function () {
        this.escalaUp = 1.0;
        this.rotacionUp = 0.0;
        this.escalaDown = 1.0;
        this.rotacionDown = 0.0;
        }
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder (titleGui);
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    // El método   listen()   permite que si se cambia el valor de la variable en código, el deslizador de la interfaz se actualice
    folder.add (this.guiControls, 'escalaUp', 1.0, 2.0, 0.1).name ('Escala superior : ').listen();
    folder.add (this.guiControls, 'rotacionUp', -0.5, 0.5, 0.1).name ('Rotacion superior : ').listen();
    folder.add (this.guiControls, 'escalaDown', 1.0, 2.0, 0.1).name ('Escala inferior : ').listen();
    folder.add (this.guiControls, 'rotacionDown', -0.5, 0.5, 0.1).name ('Rotación inferior : ').listen();
    
    folder.add (this.guiControls, 'reset').name ('[ Reset ]');
  }
  
  update () {
    // Con independencia de cómo se escriban las 3 siguientes líneas, el orden en el que se aplican las transformaciones es:
    // Primero, el escalado
    // Segundo, la rotación en Z
    // Después, la rotación en Y
    // Luego, la rotación en X
    // Y por último la traslación
    this.boxUp.scale.y = this.guiControls.escalaUp;

    this.boxDown.position.y = -this.h*this.guiControls.escalaUp;
    this.boxDown.rotation.z = this.guiControls.rotacionDown;
    this.boxDown.scale.y = this.guiControls.escalaDown;

    this.rotation.z = this.guiControls.rotacionUp;
  }
}

export { Pendulos };
