<template>
  <component :is="isList ? 'ul' : 'div'" class="items" :class="variant">
    <component :is="isList ? 'li' : 'div'" v-for="item in items" :key="item.title">
      <h3>{{ item.title }}</h3>
      <p v-for="line in linesOf(item)" :key="line">{{ line }}</p>
    </component>
  </component>
</template>

<script setup>
import { computed } from 'vue'

// variant: 'columns' (3 cols) | 'two' (2 cols) | 'list' (bordered list)
// item: { title, text } or { title, lines: [] }
const props = defineProps({
  items: { type: Array, required: true },
  variant: { type: String, default: 'columns' },
})

const isList = computed(() => props.variant === 'list')
const linesOf = (item) => item.lines ?? [item.text]
</script>

<style scoped>
.items { display: grid; grid-template-columns: 1fr; gap: 1.25rem 2rem; max-width: 64rem; margin-top: 2rem; }
.items.two { max-width: 56rem; }
.items.list { list-style: none; gap: 1rem 3rem; max-width: 56rem; }
.list > li { border-left: 4px solid #008DDA; padding-left: 1rem; }

h3 { color: var(--panel-accent, inherit); font-size: 1.15rem; font-weight: 700; margin-bottom: .4rem; }
p { color: inherit; font-size: 1rem; line-height: 1.55; margin-bottom: .4rem; }

@media (min-width: 600px) { .items.list { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 900px) {
  .items { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
  .items.two { grid-template-columns: repeat(2, 1fr); }
  .items.list { grid-template-columns: repeat(3, 1fr); gap: 1.5rem 2.5rem; }
}

@media (max-width: 768px) {
  .items { gap: .75rem; margin-top: 1rem; }
  h3 { font-size: 1.02rem; margin-bottom: .15rem; }
  p { font-size: .88rem; line-height: 1.45; margin-bottom: .25rem; }
  .list > li { padding-left: .75rem; border-left-width: 3px; }
}

@media (max-height: 700px) {
  .items { margin-top: .75rem; gap: .6rem 1.5rem; }
  p { font-size: .82rem; line-height: 1.4; }
  h3 { font-size: .98rem; }
}
@media (max-height: 560px) and (orientation: landscape), (max-width: 900px) and (orientation: landscape) {
  .items, .items.list { grid-template-columns: repeat(3, 1fr); }
  .items.two { grid-template-columns: repeat(2, 1fr); }
}
@media (max-height: 640px) and (max-width: 600px) { .list > li p { display: none; } }
</style>