type Question = {
    id: number
    title_no: string
    title_en: string
    categories: string[]
}

type NeverHaveIEver = {
    id: number
    title_no: string
    title_en: string
    categories: string[]
}

type OkRedFlagDealBreaker = {
    id: number
    title_no: string
    title_en: string
}

type Game = {
    id: number
    name: string
    endpoint: string
    description_no: string
    description_en: string
}

type AppNotificationSubscription = {
    token: string
    topics: string[]
    createdAt: string
    updatedAt: string
}

type AppNotificationHistoryEntry = {
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

type ScheduledNotificationStatus = 'scheduled' | 'processing' | 'sent' | 'failed' | 'cancelled'

type ScheduledNotificationRecord = {
    id: string
    title: string
    body: string
    topic: string
    data: Record<string, string>
    scheduledAt: string
    status: ScheduledNotificationStatus
    createdAt: string
    updatedAt: string
    sentAt: string | null
    cancelledAt: string | null
    lastError: string | null
    delivered: number | null
    failed: number | null
    historyId: string | null
    createdBy: string | null
}
