import './imgerr.css'
//import lituiLogo from '../../../public/lit.svg'

export default {
  mounted(el, binding) {
    if (binding.modifiers.default) {
      const placeholderImg = binding.value ?? ''
      const dataVImgerrImg = document.createAttribute('data-v-imgerr-img')
      dataVImgerrImg.nodeValue = placeholderImg
      el.attributes.setNamedItem(dataVImgerrImg)
    }
    const placeholderEmoji =
      !binding.modifiers.default && binding.value ? binding.value : '🙈'
    const dataVImgerrEmoji = document.createAttribute('data-v-imgerr-emoji')
    dataVImgerrEmoji.nodeValue = placeholderEmoji
    el.attributes.setNamedItem(dataVImgerrEmoji)

    el.addEventListener('error', () => {
      el.classList.add('lit-v-imgerr')
      if (el.getAttribute('data-v-imgerr-img')) {
        el.src = el.getAttribute('data-v-imgerr-img')
      }
    })
  }
}
