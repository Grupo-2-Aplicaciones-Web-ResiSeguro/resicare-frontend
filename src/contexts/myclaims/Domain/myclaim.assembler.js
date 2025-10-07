import { MyClaim } from './myclaim.entity';

export const MyClaimAssembler = {
  fromApiResponse(apiResponse) {
    // Mapea los campos reales del db.json
    return new MyClaim({
      id: apiResponse.id,
      tipo: apiResponse.tipo,
      fechaIncidente: apiResponse.fechaIncidente,
      descripcionBreve: apiResponse.descripcionBreve,
      objetoRegistrado: apiResponse.objetoRegistrado,
      fotosDocumentos: apiResponse.fotosDocumentos,
      estado: apiResponse.estado,
      fechaCreacion: apiResponse.fechaCreacion
    });
  },

  toApiRequest(myClaim) {
    return {
      id: myClaim.id,
      tipo: myClaim.tipo,
      fechaIncidente: myClaim.fechaIncidente,
      descripcionBreve: myClaim.descripcionBreve,
      objetoRegistrado: myClaim.objetoRegistrado,
      fotosDocumentos: myClaim.fotosDocumentos,
      estado: myClaim.estado,
      fechaCreacion: myClaim.fechaCreacion
    };
  }
};
