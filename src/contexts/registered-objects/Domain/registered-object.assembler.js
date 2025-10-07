import { RegisteredObject } from './registered-object.entity'

export class RegisteredObjectAssembler {
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.code}, ${response.message}`)
            return []
        }
        const objectsResponse = response.data
        return objectsResponse.map((obj) => this.toEntityFromResource(obj))
    }

    static toEntityFromResource(resource) {
        return new RegisteredObject(resource)
    }

    static toResourceFromEntity(registeredObject) {
        return {
            tipo: registeredObject.tipo,
            nombre: registeredObject.nombre,
            descripcionBreve: registeredObject.descripcionBreve,
            precio: registeredObject.precio,
            numeroSerie: registeredObject.numeroSerie,
            foto: registeredObject.foto,
            fechaRegistro: registeredObject.fechaRegistro
        }
    }
}
