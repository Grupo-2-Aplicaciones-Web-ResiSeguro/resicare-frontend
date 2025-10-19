import { Reminder } from './reminder.entity'

export class ReminderAssembler {
    static toEntitiesFromResponse(response) {
        const data = (response && response.data) ? response.data : response
        if (response && response.status && response.status !== 200) {
            console.error(`${response.status}, ${response.code || ''}, ${response.message || ''}`)
            return []
        }
        if (!Array.isArray(data)) return []
        return data.map(r => this.toEntityFromResource(r))
    }

    static toEntityFromResource(resource = {}) {
        return new Reminder({
            id: resource.id ?? null,
            title: resource.title ?? '',
            type: resource.type ?? '',
            date: resource.date ?? '',
            time: resource.time ?? '',
            notes: resource.notes ?? '',
            createdAt: resource.createdAt ?? null,
            updatedAt: resource.updatedAt ?? null,
            userId: resource.userId ?? null
        })
    }

    static toResourceFromEntity(reminder) {
        return {
            id: reminder.id ?? null,
            title: reminder.title ?? '',
            type: reminder.type ?? '',
            date: reminder.date ?? '',
            time: reminder.time ?? '',
            notes: reminder.notes ?? '',
            createdAt: reminder.createdAt ?? null,
            updatedAt: reminder.updatedAt ?? null,
            userId: reminder.userId ?? null
        }
    }
}

