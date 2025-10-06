import { ReimbursementSimulator } from './reimbursement-simulator.entity.js'

export class ReimbursementSimulatorAssembler {
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.code}, ${response.message}`)
            return []
        }
        const simulatorsResponse = response.data
        return simulatorsResponse.map((simulator) => this.toEntityFromResource(simulator))
    }

    static toEntityFromResource(resource) {
        return new ReimbursementSimulator(resource)
    }
}
