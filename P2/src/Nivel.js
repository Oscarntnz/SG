

class Nivel {
    constructor(nivel = 1, dificultad) {
        this.crearNivel(nivel);
    }

    crearNivel(nivel, dificultad) {
        this.nivel = nivel;

        if(this.nivel < 1)
            this.nivel = 1;

        // cada nivel es un 0.3 veces más rápido que el anterior

        this.vCaida = 1 + 0.3*(this.nivel - 1);

        // cada nivel requiere una puntuacion 0.5 veces mayor

        this.puntuacionABatir = 1000 + 1000*(this.nivel/10);
    }
}