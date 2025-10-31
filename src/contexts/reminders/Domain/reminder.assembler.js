import { Reminder } from './reminder.entity'

export class ReminderAssembler {
    static toEntitiesFromResponse(response) {
        const data = (response && response.data) ? response.data : response
        if (response && response.status && !(response.status >= 200 && response.status < 300)) {
            console.error(`${response.status}, ${response.code || ''}, ${response.message || ''}`)
            return []
        }
        if (!Array.isArray(data)) return []
        return data.map(r => this.toEntityFromResource(r))
    }

    static toEntityFromResource(resource = {}) {
        const parseNumber = (v) => {
            if (v === null || v === undefined) return null
            const n = Number(v)
            return Number.isNaN(n) ? null : n
        }

        return new Reminder({
            id: parseNumber(resource.id),
            title: resource.title ?? '',
            type: resource.type ?? '',
            date: resource.date ?? '',
            time: resource.time ?? '',
            notes: resource.notes ?? '',
            createdAt: resource.createdAt ?? null,
            updatedAt: resource.updatedAt ?? null,
            userId: parseNumber(resource.userId)
        })
    }

    static toResourceFromEntity(reminder) {
        const toNumOrNull = (v) => {
            if (v === null || v === undefined) return null
            const n = Number(v)
            return Number.isNaN(n) ? null : n
        }

        return {
            // si id existe y es numérico lo enviamos como número; si no, lo omitimos (servidor asignará)
            ...(reminder.id != null ? { id: toNumOrNull(reminder.id) } : {}),
            title: reminder.title ?? '',
            type: reminder.type ?? '',
            date: reminder.date ?? '',
            time: reminder.time ?? '',
            notes: reminder.notes ?? '',
            createdAt: reminder.createdAt ?? null,
            updatedAt: reminder.updatedAt ?? null,
            userId: toNumOrNull(reminder.userId)
        }
    }
}
