<template>
  <div class="lit-crop-image">
    <img :src="props.imageSrc" :alt="props.imgAlt" @click="openDialog" />
    <teleport :to="props.cropDialogPosition">
      <div ref="cropImageDialogRef" class="lit-crop-image-dialog">
        <div
          class="lit-crop-image-dialog-body"
          :style="{ width: props.cropDialogWidth }"
        >
          <img
            ref="cropImageRef"
            :src="cropImageSrc"
            alt="crop image"
            @ready="handleImgUrl"
          />
          <div class="lit-crop-image-dialog-btns">
            <button>
              replace
              <input type="file" accept="image/*" @change="replaceCropImg" />
            </button>
            <button @click="uploadCropImg">upload</button>
            <button @click="confirmReplace">confirm</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { ref, onMounted } from 'vue'

const props = defineProps({
  cropConfig: {
    type: Object,
    default: rawCropConfig => {
      return {
        ...rawCropConfig,
        ...{ guides: false, center: false, background: false }
      }
    }
  },
  imageSrc: {
    type: String,
    default: ''
  },
  imgAlt: {
    type: String,
    default: 'image'
  },
  imageScale: {
    type: Number,
    default: 16 / 9
  },
  cropDialogPosition: {
    type: String,
    default: 'body'
  },
  cropDialogWidth: {
    type: String,
    default: 'auto'
  },
  action: {
    type: String,
    default: window.location.href
  }
})
const emits = defineEmits(['update:imageSrc', 'upload-img'])

const cropImageDialogRef = ref()
const openDialog = () => {
  cropImageDialogRef.value.style.setProperty('display', 'flex', 'important')
}

const cropImageRef = ref()
let cropImageSrc = ref(props.imageSrc)
let croperInstance
onMounted(() => {
  croperInstance = new Cropper(cropImageRef.value, props.cropConfig)
})

const handleImgUrl = () => {
  cropImageSrc.value = croperInstance.getCroppedCanvas().toDataURL()
}
const replaceCropImg = e => {
  const file = e.target.files[0]
  if (!file.type.includes('image/')) {
    return
  }
  const reader = new FileReader()
  reader.onload = event => {
    cropImageSrc.value = event.target.result
    croperInstance.replace(event.target.result)
  }
  reader.readAsDataURL(file)
}
const uploadCropImg = () => {
  croperInstance.getCroppedCanvas().toBlob(blob => {
    const formData = new FormData()
    formData.append('image', blob)
    fetch(props.action, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      referrerPolicy: 'no-referrer',
      body: formData
    })
      .then(response => response.json())
      .then(res => {
        emits('upload-img', res)
        croperInstance.destroy()
        cropImageDialogRef.value.style.setProperty(
          'display',
          'none',
          'important'
        )
      })
      .catch(err => {
        console.warn(`[lit-crop-image] Upload Error: ${err}`)
      })
  })
}
const confirmReplace = () => {
  emits('update:imageSrc', cropImageSrc.value)
  croperInstance.destroy()
  cropImageDialogRef.value.style.setProperty('display', 'none', 'important')
}
</script>

<style>
.lit-crop-image {
}

.lit-crop-image-dialog {
  position: fixed;
  display: none;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 999;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(
    to top,
    rgb(207, 217, 223, 0.1) 0%,
    rgb(226, 235, 240, 0.1) 100%
  );
}

.lit-crop-image-dialog-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 1px 2px 8px 2px rgba(0, 0, 0, 0.5);
  /* width: v-bind('props.cropDialogWidth'); */
  box-sizing: border-box;
  padding: 8px;
}

.lit-crop-image-dialog-body > img {
  max-width: 400px;
}

.lit-crop-image-dialog-btns {
  width: 100%;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.lit-crop-image-dialog-btns > button {
  border: none;
  border-radius: 4px;
  height: 20px;
  position: relative;
}

.lit-crop-image-dialog-btns > button:hover {
  color: #ffffff;
  background: #ffc400;
}

.lit-crop-image-dialog-btns > button > input {
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
