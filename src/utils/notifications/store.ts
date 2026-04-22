import config from '#constants'
import { mkdir, readFile, rename, writeFile } from 'fs/promises'
import { randomUUID } from 'crypto'

const subscriptionsPath = `${config.notifications.storageDir}/subscriptions.json`
const notificationsPath = `${config.notifications.storageDir}/history.json`

export type AppNotificationSubscription = {
    token: string
    topics: string[]
    createdAt: string
    updatedAt: string
}

export type AppNotificationHistoryEntry = {
    id: string
    title: string
    body: string
    topic: string
    data: Record<string, string>
    sentAt: string
    delivered: number
    failed: number
    ticketIds: string[]
}

async function ensureStore() {
    await mkdir(config.notifications.storageDir, { recursive: true })
}

async function readJsonFile<T>(path: string, fallback: T) {
    await ensureStore()

    try {
        const content = await readFile(path, 'utf8')
        return JSON.parse(content) as T
    } catch {
        return fallback
    }
}

async function writeJsonFile(path: string, value: unknown) {
    await ensureStore()
    const tempPath = `${path}.${randomUUID()}.tmp`
    await writeFile(tempPath, JSON.stringify(value, null, 2))
    await rename(tempPath, path)
}

export async function listSubscriptions() {
    return await readJsonFile<AppNotificationSubscription[]>(subscriptionsPath, [])
}

export async function saveSubscriptions(subscriptions: AppNotificationSubscription[]) {
    await writeJsonFile(subscriptionsPath, subscriptions)
}

export async function upsertSubscription(token: string, topic: string) {
    const now = new Date().toISOString()
    const subscriptions = await listSubscriptions()
    const existing = subscriptions.find((item) => item.token === token)

    if (existing) {
        existing.topics = Array.from(new Set([...existing.topics, topic])).sort()
        existing.updatedAt = now
    } else {
        subscriptions.push({
            token,
            topics: [topic],
            createdAt: now,
            updatedAt: now,
        })
    }

    await saveSubscriptions(subscriptions)
}

export async function removeSubscription(token: string, topic: string) {
    const subscriptions = await listSubscriptions()
    const next = subscriptions
        .map((subscription) => {
            if (subscription.token !== token) {
                return subscription
            }

            return {
                ...subscription,
                topics: subscription.topics.filter((item) => item !== topic),
                updatedAt: new Date().toISOString(),
            }
        })
        .filter((subscription) => subscription.topics.length > 0)

    await saveSubscriptions(next)
}

export async function listNotificationHistory(limit = 25) {
    const history = await readJsonFile<AppNotificationHistoryEntry[]>(notificationsPath, [])
    return history.slice(0, limit)
}

export async function getNotificationHistoryEntry(id: string) {
    const history = await readJsonFile<AppNotificationHistoryEntry[]>(notificationsPath, [])
    return history.find((entry) => entry.id === id) || null
}

export async function addNotificationHistoryEntry(entry: Omit<AppNotificationHistoryEntry, 'id'>) {
    const history = await readJsonFile<AppNotificationHistoryEntry[]>(notificationsPath, [])
    const nextEntry: AppNotificationHistoryEntry = {
        id: randomUUID(),
        ...entry,
    }

    history.unshift(nextEntry)
    await writeJsonFile(notificationsPath, history.slice(0, 250))
    return nextEntry
}
