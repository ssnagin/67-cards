<script setup lang="ts">
const model = defineModel<string>({ required: true })

// Поле ввода по дизайну: 48 px высоты, фон canvas, скругление 2 px, текст 15 px Onest.
// Лейбл и подсказки рендерит родитель — здесь только сам input + опциональный слот справа
// (например, кнопка «показать пароль»). Атрибуты прокидываются на input автоматически.
</script>

<template>
  <div class="group relative">
    <input
      v-model="model"
      class="min-h-12 w-full min-w-0 rounded-control border border-divider bg-canvas px-3.5 pr-11 text-[15px] leading-5 text-content placeholder:text-muted read-only:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
    <div v-if="$slots.trailing" class="absolute inset-y-0 right-0 flex items-center pr-0.5">
      <slot name="trailing" />
    </div>
  </div>
</template>
