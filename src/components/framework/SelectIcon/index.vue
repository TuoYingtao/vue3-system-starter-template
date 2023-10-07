<template>
  <div class="icon-body">
    <t-input
        v-model="name"
        style="position: relative"
        clearable
        placeholder="请输入图标名称"
        @clear="filterIcons"
        @change.native="filterIcons"
    >
      <template #suffixIcon>
        <t-icon :size="25" name="search"></t-icon>
      </template>
      <!--      <i slot="suffix" class="el-icon-search el-input__icon" />-->
    </t-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" class="icon-item" @click="selectedIcon(item)">
        <svg-icon v-if="iconHandler(item.stem)" :icon-class="item.stem" style="height: 40px; width: 40px"/>
        <t-icon v-else size="45" :name="item.stem"></t-icon>
        <span>{{ item.stem }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import icons from './requireIcons';
// import SvgIcon from '@/components/SvgIcon/index-1.vue';

const emit = defineEmits(['selected']);
const name = ref<string>('');
const iconList = ref('');

onMounted(() => {
  initIconData();
});

function initIconData() {
  iconList.value = [...icons];
}

function iconHandler(iconName) {
  return iconName.indexOf('assets') !== -1;
}

function filterIcons() {
  initIconData();
  if (name.value) {
    iconList.value = iconList.value.filter((item) => item.stem.includes(name.value));
  }
}

function selectedIcon(name: string) {
  emit('selected', name);
  document.body.click();
}

function reset() {
  name.value = '';
  initIconData();
}

// eslint-disable-next-line no-undef
defineExpose({reset});
</script>

<style lang="less" scoped>
.icon-body {
  width: 100%;
  padding: 10px;

  .icon-list {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-row-gap: 40px;
    grid-column-gap: 40px;
    padding: 25px 0;
    height: 350px;
    overflow-y: scroll;

    .icon-item {
      display: flex;
      justify-content: start;
      align-items: center;
    }

    div {
      cursor: pointer;
    }

    span {
      padding-left: 6px;
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
