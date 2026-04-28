<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { dashboardApi, type DashboardDocument } from '../../features/dashboard'

const route = useRoute()
const progress = ref(0)
const selectedDoc = ref<DashboardDocument | null>(null)

const formattedSize = computed(() => {
  if (!selectedDoc.value) return ''
  return `${selectedDoc.value.sizeMb.toFixed(1)} MB`
})

const previewUrl = computed(() => {
  if (!selectedDoc.value?.previewUrl) return ''
  return selectedDoc.value.previewUrl
})

const previewCoverUrl = computed(() => {
  if (!previewUrl.value) return ''
  return `${previewUrl.value}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH`
})

const isPreviewReady = computed(() => progress.value >= 100)

onMounted(async () => {
  const docId = Number(route.query.docId)
  if (!Number.isNaN(docId)) {
    const recent = await dashboardApi.getRecentDocuments()
    selectedDoc.value = recent.find((item) => item.id === docId) ?? null
  }

  let step = 0
  const timer = window.setInterval(() => {
    step += 8
    progress.value = Math.min(step, 100)
    if (progress.value >= 100) {
      window.clearInterval(timer)
    }
  }, 180)
})
</script>

<template>
  <section class="page">
    <h2 class="sign-title">İmzala</h2>

    <div class="sign-upload-row">
      <div class="sign-drop-tile">
        <span class="sign-plus">+</span>
        <p>Dosyanızı yüklemek için buraya tıklayın ya da sürükleyip bırakın..</p>
      </div>

      <article v-if="selectedDoc && !isPreviewReady" class="sign-file-card">
        <div class="sign-file-thumb">
          <div class="sign-loader"></div>
        </div>
        <div class="sign-file-name">{{ selectedDoc.name }}</div>
        <div class="sign-file-size">{{ formattedSize }}</div>
        <div class="sign-progress-line">
          <span :style="{ width: `${progress}%` }"></span>
        </div>
        <div class="sign-progress-badge">{{ progress }}%</div>
      </article>

      <article v-else-if="selectedDoc && isPreviewReady" class="sign-preview-card">
        <div class="sign-cover-thumb">
          <iframe
            v-if="previewCoverUrl"
            class="sign-cover-frame"
            :src="previewCoverUrl"
            title="Yüklenen dosya kapak önizleme"
            scrolling="no"
          ></iframe>

          <div v-else class="sign-cover-fallback">PDF</div>
        </div>

        <div class="sign-file-name">{{ selectedDoc.name }}</div>
        <div class="sign-file-size">{{ formattedSize }}</div>
      </article>
    </div>
  </section>
</template>
