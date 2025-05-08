<script setup>
import { ref, watch, onMounted } from 'vue'
import html2canvas from 'html2canvas'

const emit = defineEmits(['screenshot'])

const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '400px'
  },
  operatingHours: {
    type: Object,
    default: () => ({
      '2025-01-01': {
        morning: { start: '09:00', end: '12:00' },
        afternoon: { start: '13:00', end: '17:00' }
      },
    })
  },
});

const sandboxFrame = ref(null)

const updateIframe = async () => {
  if (!sandboxFrame.value) return

  // AIDEV-NOTE: Ensure code is always a string to prevent [object Object] serialization errors
  const codeString = typeof props.code === 'string' ? props.code : JSON.stringify(props.code, null, 2)

  const closeScript = '</' + 'script>';
  const closeHead = '</' + 'head>';
  const closeBody = '</' + 'body>';
  const closeHtml = '</' + 'html>';

  const html = '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<script src="https://cdn.tailwindcss.com">' + closeScript +
    '<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js">' + closeScript +
    '<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js">' + closeScript +
    '<script src="https://unpkg.com/@babel/standalone/babel.min.js">' + closeScript +
    closeHead +
    '<body>' +
    '<div id="root"></div>' +
    '<script type="text/babel">' +
    codeString +
    '\n\n' +
    'try {' +
    'const App = window.App;' +
    `ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App, ${JSON.stringify({ operatingHours: props.operatingHours })}));` +
    '} catch (e) {' +
    'document.getElementById("root").innerHTML = ' +
    '"<div style=\\"color: red; padding: 10px;\\"><h3>Error:</h3><pre>" + e.message + "</pre></div>";' +
    '}' +
    closeScript +
    closeBody +
    closeHtml;

  sandboxFrame.value.srcdoc = html;

  // Wait for iframe to load
  sandboxFrame.value.onload = async () => {
    try {
      const canvas = await html2canvas(sandboxFrame.value.contentDocument.body)
      const image = canvas.toDataURL('image/png')
      emit('screenshot', image)
    } catch (error) {
      console.error('Error capturing screenshot:', error)
      emit('screenshot', null)
    }
  }
}

// Watch for code and operatingHours changes
watch(() => [props.code, props.operatingHours], () => {
  updateIframe()
}, { immediate: false, deep: true })

// Initialize on mount

onMounted(() => {
  if (props.code) {
    updateIframe()
  }
})
</script>

<template>
  <div>
    <iframe ref="sandboxFrame" sandbox="allow-scripts allow-same-origin"
      :style="{ width: '100%', height: height, border: '1px solid #ccc', borderRadius: '8px' }">
    </iframe>
  </div>
</template>
