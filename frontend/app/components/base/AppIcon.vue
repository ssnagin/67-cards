<script setup lang="ts">
// Иконка — это Font Awesome (webfont из @fortawesome/fontawesome-free).
// Мы не храним SVG-пути сами: только маппинг семантического имени на класс FA.
// Иконка наследует цвет через currentColor, размер — через font-size (свойство size).
type IconName =
  | 'cards' | 'chevron-down' | 'clock' | 'arrow-right' | 'sliders'
  | 'ellipsis-vertical' | 'image' | 'lock' | 'eye' | 'check' | 'logout' | 'user'

// fa-solid (filled) vs fa-regular (outline) — в соответствии с исходным набором FA Free.
const FA_CLASS: Record<IconName, string> = {
  cards: 'fa-solid fa-layer-group',
  'chevron-down': 'fa-solid fa-chevron-down',
  clock: 'fa-regular fa-clock',
  'arrow-right': 'fa-solid fa-arrow-right',
  sliders: 'fa-solid fa-sliders',
  'ellipsis-vertical': 'fa-solid fa-ellipsis-vertical',
  image: 'fa-regular fa-image',
  lock: 'fa-solid fa-lock',
  eye: 'fa-regular fa-eye',
  check: 'fa-solid fa-check',
  logout: 'fa-solid fa-arrow-right-from-bracket',
  user: 'fa-regular fa-user',
}

const props = defineProps<{ name: IconName; size?: number }>()
const size = computed(() => props.size ?? 24)
</script>

<template>
  <i
    :class="FA_CLASS[name]"
    :style="{ fontSize: `${size}px`, width: `${size}px`, height: `${size}px`, lineHeight: `${size}px` }"
    aria-hidden="true"
  />
</template>
