export class Vehiculo {
    constructor(id, modelo, anoFab, velMax){
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }
    toString() {
        return `${this.id} ${this.nombre} ${this.apellido} ${this.nombre} ${this.edad}`;
    }
    toJson() {
        return JSON.stringify(this);
    }
}

export class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia){
        super(id, modelo, anoFab, velMax)
        this.altMax = altMax;
        this.autonomia = autonomia;
    }
    toJson() {
        return JSON.stringify(this);
    }
}

export class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue){
        super(id, modelo, anoFab, velMax)
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }
    toJson() {
        return JSON.stringify(this);
    }  
}

export function fromJsonToObj(jsonArray){
    let vehiculos = jsonArray.map((item) => {
        if (item.hasOwnProperty("altMax") && item.hasOwnProperty("autonomia")) {
            return new Aereo(item.id, item.modelo, item.anoFab, item.velMax, item.altMax, item.autonomia);
        } else if (item.hasOwnProperty("cantPue") && item.hasOwnProperty("cantRue")) {
            return new Terrestre(item.id, item.modelo, item.anoFab, item.velMax, item.cantPue, item.cantRue);
        } else {
            return new Vehiculo(item.id, item.modelo, item.anoFab, item.velMax,);
        }
    });
    return vehiculos;
}