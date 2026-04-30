<script setup lang="ts">
import { computed } from 'vue'
import type { IconName } from './icon-types'



type IconShape = {
  viewBox?: string
  fill?: 'currentColor' | 'none'
  paths: string[]
  circles?: Array<{ cx: string | number; cy: string | number; r: string | number }>
  rects?: Array<{ x: number; y: number; width: number; height: number; rx?: number }>
  ellipses?: Array<{ cx: number; cy: number; rx: number; ry: number }>
}

const ICONS: Record<IconName, IconShape> = {
  home: {
    paths: ['M3 11l9-8 9 8', 'M5 9v11h14V9', 'M10 20v-6h4v6'],
  },
  sign: {
    paths: ['M14 4l6 6-11 11H3v-6z', 'M13 5l6 6'],
  },
  clock: {
    paths: ['M12 7v5l3 2'],
    circles: [{ cx: 12, cy: 12, r: 9 }],
  },
  archive: {
    paths: ['M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8', 'M10 12h4'],
    rects: [{ x: 3, y: 4, width: 18, height: 4, rx: 1 }],
  },
  pen: {
    paths: ['M4 20h4l10-10-4-4L4 16v4z', 'M13.5 6.5l4 4'],
  },
  stamp: {
    paths: ['M5 21h14', 'M9 17h6l1.5-3a4 4 0 0 0-1-5L14 7V5a2 2 0 1 0-4 0v2L7.5 9a4 4 0 0 0-1 5z'],
  },
  share: {
    paths: ['M8.59 13.51l6.83 3.98', 'M15.41 6.51l-6.82 3.98'],
    circles: [
      { cx: 18, cy: 5, r: 3 },
      { cx: 6, cy: 12, r: 3 },
      { cx: 18, cy: 19, r: 3 },
    ],
  },
  'paper-plane': {
    paths: ['M22 2L11 13', 'M22 2l-7 20-4-9-9-4z'],
  },
  eye: {
    paths: ['M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z'],
    circles: [{ cx: 12, cy: 12, r: 2.5 }],
  },
  download: {
    paths: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  },
  'menu-dots': {
    fill: 'currentColor',
    paths: [],
    circles: [
      { cx: 6, cy: 12, r: 1.8 },
      { cx: 12, cy: 12, r: 1.8 },
      { cx: 18, cy: 12, r: 1.8 },
    ],
  },
  menu: {
    paths: ['M3 6h18', 'M3 12h18', 'M3 18h18'],
  },
  search: {
    paths: ['M16.1 16.1L20 20'],
    circles: [{ cx: 11, cy: 11, r: 6.8 }],
  },
  check: {
    paths: ['M5 12l5 5L20 7'],
  },
  close: {
    paths: ['M6 6l12 12M18 6L6 18'],
  },
  'arrow-right': {
    paths: ['M5 12h14M13 5l7 7-7 7'],
  },
  box: {
    paths: [
      'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
      'M3.27 6.96L12 12.01l8.73-5.05',
      'M12 22.08V12',
    ],
  },
  credit: {
    paths: ['M12 7v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3H9.5a1.5 1.5 0 0 0 0 3H14'],
    circles: [{ cx: 12, cy: 12, r: 9 }],
  },
  'archive-stack': {
    paths: ['M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5', 'M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6'],
    ellipses: [{ cx: 12, cy: 5, rx: 8, ry: 3 }],
  },
  lock: {
    paths: ['M8 11V8a4 4 0 1 1 8 0v3'],
    rects: [{ x: 4, y: 11, width: 16, height: 10, rx: 2 }],
  },
  user: {
    paths: ['M20 21a8 8 0 0 0-16 0'],
    circles: [{ cx: 12, cy: 8, r: 4 }],
  },
  'chevron-down': {
    paths: ['M6 9l6 6 6-6'],
  },
  trash: {
    paths: ['M3 6h18', 'M8 6V4h8v2', 'M19 6l-1 14H6L5 6', 'M10 10v7', 'M14 10v7'],
  },
  mail: {
    paths: ['M22 6l-10 7L2 6'],
    rects: [{ x: 2, y: 4, width: 20, height: 16, rx: 2 }],
  },
  shield: {
    paths: ['M12 2l8 3v7c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z'],
  },
  file: {
    paths: ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6'],
  },
  'upload-cloud': {
    paths: [
      'M16 16l-4-4-4 4',
      'M12 12v9',
      'M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3',
      'M16 16l-4-4-4 4',
    ],
  },
  logout: {
    paths: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  },
  globe: {
    paths: ['M2 12h20', 'M12 2a15 15 0 0 1 0 20', 'M12 2a15 15 0 0 0 0 20'],
    circles: [{ cx: 12, cy: 12, r: 10 }],
  },
  inbox: {
    paths: [
      'M22 12h-6l-2 3h-4l-2-3H2',
      'M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
    ],
  },
  plus: {
    paths: ['M12 5v14', 'M5 12h14'],
  },
}

const props = withDefaults(
  defineProps<{
    name: IconName
    size?: number | string
    strokeWidth?: number | string
    decorative?: boolean
    title?: string
  }>(),
  {
    size: 18,
    strokeWidth: 1.6,
    decorative: true,
    title: '',
  },
)

const shape = computed(() => ICONS[props.name])
const fill = computed(() => shape.value.fill ?? 'none')
const stroke = computed(() => (shape.value.fill === 'currentColor' ? 'none' : 'currentColor'))
const sizeAttr = computed(() => String(props.size))

defineOptions({ name: 'BaseIcon' })
</script>

<template>
  <svg
    :viewBox="shape.viewBox || '0 0 24 24'"
    :fill="fill"
    :stroke="stroke"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :width="sizeAttr"
    :height="sizeAttr"
    :aria-hidden="decorative ? 'true' : undefined"
    :role="decorative ? undefined : 'img'"
    :aria-label="!decorative ? title : undefined"
  >
    <title v-if="!decorative && title">{{ title }}</title>
    <path v-for="(d, idx) in shape.paths" :key="`p-${idx}`" :d="d"></path>
    <circle
      v-for="(c, idx) in shape.circles"
      :key="`c-${idx}`"
      :cx="c.cx"
      :cy="c.cy"
      :r="c.r"
    ></circle>
    <rect
      v-for="(r, idx) in shape.rects"
      :key="`r-${idx}`"
      :x="r.x"
      :y="r.y"
      :width="r.width"
      :height="r.height"
      :rx="r.rx"
    ></rect>
    <ellipse
      v-for="(e, idx) in shape.ellipses"
      :key="`e-${idx}`"
      :cx="e.cx"
      :cy="e.cy"
      :rx="e.rx"
      :ry="e.ry"
    ></ellipse>
  </svg>
</template>
