<template>
  <q-item
    clickable
    tag="a"
    target="_blank"
    :href="link"
    :inset-level="inset"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'MenuLink',
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    link: {
      type: String,
      default: '#'
    },
    inset: {
      type: Number,
      default: 0
    },

    icon: {
      type: String,
      default: ''
    }
  }
}
</script>
