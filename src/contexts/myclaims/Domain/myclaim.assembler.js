import { MyClaim } from './myclaim.entity';

export const MyClaimAssembler = {
  fromApiResponse(apiResponse) {
    return new MyClaim({
      id: apiResponse.id,
      type: apiResponse.type,
      description: apiResponse.description,
      incidentDate: apiResponse.incident_date,
      registeredObject: apiResponse.registered_object,
      status: apiResponse.status,
      attachments: apiResponse.attachments
    });
  },

  toApiRequest(myClaim) {
    return {
      id: myClaim.id,
      type: myClaim.type,
      description: myClaim.description,
      incident_date: myClaim.incidentDate,
      registered_object: myClaim.registeredObject,
      status: myClaim.status,
      attachments: myClaim.attachments
    };
  }
};
