class TipoBloques {
    static TIPOS = {I: 0xFF0000, J: 0xFFFF00, L: 0x00FF00, O: 0x00AA00, S: 0x00FFFF, T: 0x0000FF, Z: 0xFF00FF,
    B: 0xFFFFFF};
    static EMISIVO = 0x121212;

    static esValido(tipo) {
        var valido = false;

        for(const t in TipoBloques.TIPOS) {
            if(t == tipo){
                valido = true;

                break;
            }
        }

        return valido;
    }

    static predeterminado() {
        return 'I';
    }

    static getColor(tipo) {
        if(!TipoBloques.esValido(tipo))
            tipo = TipoBloques.predeterminado();

        return TipoBloques.TIPOS[tipo];
    }

    static getTipos() {
        return TipoBloques.TIPOS;
    }

    static aleatorio() {
        const keys = Object.keys(TipoBloques.TIPOS);

        return keys[Math.floor(Math.random() * (keys.length - 1))];
    }
}

export {TipoBloques};