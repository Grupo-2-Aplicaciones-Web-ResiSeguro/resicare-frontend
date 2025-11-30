export class ReimbursementSimulator {
    constructor({
                    id = '',
                    planElegido = '',
                    duracionCobertura = '',
                    frecuenciaPago = '',
                    objetosAsegurados = [],
                    montoTotal = 0,
                    descuento = 0,
                    montoFinal = 0,
                    fechaCreacion = new Date().toISOString(),
                }) {
        this.id = id
        this.planElegido = planElegido
        this.duracionCobertura = duracionCobertura
        this.frecuenciaPago = frecuenciaPago
        this.objetosAsegurados = objetosAsegurados
        this.montoTotal = montoTotal
        this.descuento = descuento
        this.montoFinal = montoFinal
        this.fechaCreacion = fechaCreacion
    }
}
