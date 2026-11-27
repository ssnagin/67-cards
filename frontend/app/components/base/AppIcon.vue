<script setup lang="ts">
import { icons, type IconName } from '~/utils/icons'

withDefaults(defineProps<{
  name: IconName
  size?: number
}>(), {
  size: 24,
})
</script>

<template>
  <!-- Иконка рендерится как обычный inline SVG: наследует цвет через currentColor,
       без v-html. Размер задаётся свойством size, атрибуты прокидываются на svg. -->
  <svg
    :width="size"
    :height="size"
    :viewBox="icons[name].viewBox"
    fill="currentColor"
    role="img"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in icons[name].paths" :key="i" :d="d" />
  </svg>
</template>
