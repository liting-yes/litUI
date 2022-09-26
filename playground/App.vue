<template>
  <div class="litui-playground">
    <h1>LitUI Playground</h1>
    <CropImage v-model:imageSrc="LituiSvg" @upload-img="test"></CropImage>
  </div>
</template>

<script setup>
import LituiSvg from '../public/lit.svg'
import CropImage from '../packages/components/cropImage/CropImage.vue'
const test = a => {
  console.log(a)
}
</script>
