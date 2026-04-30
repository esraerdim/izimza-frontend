import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useActivitiesStore, type ActivityItem, type ActivityType } from '@/entities/activity'
import { LATEST_ACTIVITIES_LIMIT } from '@/shared/config'
import { useFormatDate } from '@/shared/lib'

const ACTIVITY_KEY: Record<ActivityType, string> = {
  uploaded: 'dashboard.activity.uploaded',
  timestamped: 'dashboard.activity.timestamped',
  signed: 'dashboard.activity.signed',
  shared: 'dashboard.activity.shared',
  deleted: 'dashboard.activity.deleted',
}

const TIMELINE_TONES = ['brand', 'sage', 'coral', 'amber'] as const
type TimelineTone = (typeof TIMELINE_TONES)[number]


export const useDashboardActivities = () => {
  const { t } = useI18n()
  const { formatRelativeShort } = useFormatDate()
  const activitiesStore = useActivitiesStore()

  const localizeActivity = (activity: ActivityItem): string => {
    if (activity.type && activity.fileName) {
      return t(ACTIVITY_KEY[activity.type], { name: activity.fileName })
    }
    return (activity.title ?? '').trim()
  }

  const formattedActivities = computed(() =>
    activitiesStore.items.slice(0, LATEST_ACTIVITIES_LIMIT).map((item, index) => ({
      ...item,
      title: localizeActivity(item),
      tone: (TIMELINE_TONES[index] ?? 'brand') as TimelineTone,
      subtitle: formatRelativeShort(item.createdAt),
    })),
  )

  onMounted(() => activitiesStore.load())

  return {
    formattedActivities,
    isLoading: computed(() => activitiesStore.isLoading),
    errorKey: computed(() => activitiesStore.errorKey),
  }
}
