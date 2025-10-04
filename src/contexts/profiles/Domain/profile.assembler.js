import { Profile } from './profile.entity'

export class ProfileAssembler {
    static toEntitiesFromResponse(response) {
        if (response.status !== 200) {
            console.error(`${response.status}, ${response.code}, ${response.message}`)
            return []
        }
        const profilesResponse = response.data
        return profilesResponse.map((profile) => this.toEntityFromResource(profile))
    }

    static toEntityFromResource(resource) {
        return new Profile(resource)
    }
}
