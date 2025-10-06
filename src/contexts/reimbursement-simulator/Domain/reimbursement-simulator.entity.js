export class ReimbursementSimulator {
    constructor({
                    id = '',
                    planElegido = '', // Plan seleccionado
                    duracionCobertura = '', // 1 mes, 1 semestre, 1 año, Carrera
                    frecuenciaPago = '', // Mensual, Anual (-10%)
                    objetosAsegurados = [], // Array de objetos registrados
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
