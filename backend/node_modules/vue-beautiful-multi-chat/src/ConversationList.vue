<template>
  <div class="conversation-list">
    <slot :conversations="conversations">
      <table class="" style="padding-top: 5px">
        <tbody>
          <tr v-for="conversation in conversations" :key="conversation.id">
            <td style="text-align: center;"><img :src="conversation.imageUrl" class="img-msg"/></td>
            <td class="conversation-element">{{conversation.members ? conversation.members.map(m=>m.name).join(' & ') : conversation.title}}</td>
          </tr>
        </tbody>
      </table>
    </slot>
  </div>
</template>
<script>
export default {
  props: {
    conversations: {
      type: Array,
      required: true
    }
  },
}
</script>
<style scoped>
  .conversation-list {
    height: 100%;
    overflow: auto;
  }
  .img-msg {
    border-radius: 50%;
    width: 50px;
    margin-right: 5px;
  }
  .conversation-element {
    font-size: 20px;
    vertical-align: middle;
  }
</style>
