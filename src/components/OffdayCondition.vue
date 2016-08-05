<template>
  <div class="dayoff-options">
    例假日工作條件設定：
    <div class="radio">
      <label>
        <input type="radio" value="disaster" v-model="reason">
        發生天災、事變或突發事件，雇主停止休假要求勞工出勤
      </label>
    </div>
    <div class="radio">
      <label>
        <input type="radio" value="laborAgree" v-model="reason">
        <span class="strong">沒有</span>發生上述事件，但雇主要求上班，且勞工同意於例假日出勤
      </label>
    </div>
    <div class="radio">
      <label>
        <input type="radio" value="laborDisagree" v-model="reason">
        <span class="strong">沒有</span>發生上述事件，但雇主要求上班，而勞工拒絕於例假日出勤
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: ['reason'],
  watch: {
    reason (val) {
      this.$dispatch('reason-changed', val);
    }
  }
};
</script>

<style>
.strong {
  color: red;
  font-weight: bold;
}

</style>