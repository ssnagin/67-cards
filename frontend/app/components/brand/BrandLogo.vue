<script setup lang="ts">
// Логотип 67 Cards: фиолетовый знак-квадрат с «67» (Unbounded) и подпись «CARDS».
// Размеры из макета: знак 52×52, радиус 2 px, «67» — Unbounded SemiBold 20, «CARDS» — Unbounded Medium 18.
withDefaults(defineProps<{ to?: string }>(), { to: '/' })
</script>

<template>
  <NuxtLink
    :to="to"
    class="inline-flex items-center gap-[13px] text-content focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
    aria-label="67 Cards — на главную"
  >
    <span class="grid h-[52px] w-[52px] place-items-center rounded-control bg-brand-primary">
      <span class="font-display text-[20px] font-semibold leading-none">67</span>
    </span>
    <span class="font-display text-[18px] font-medium tracking-wide">CARDS</span>
  </NuxtLink>
</template>
