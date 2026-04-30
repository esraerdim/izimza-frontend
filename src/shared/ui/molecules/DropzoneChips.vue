<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ActionChip from './ActionChip.vue'

const { t } = useI18n()
</script>

<template>
  <div class="drop-chips">
    <ActionChip :label="t('documents.chips.sign')" icon="sign" />
    <ActionChip :label="t('documents.chips.timestamp')" icon="stamp" />
    <ActionChip :label="t('documents.chips.share')" icon="share" />
  </div>
</template>

<style scoped>
.drop-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}
</style>
