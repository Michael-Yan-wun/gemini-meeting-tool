<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
        <h1 class="text-2xl font-bold text-white">🎙️ AI 會議記錄助手</h1>
        <p class="text-blue-100 mt-2 text-sm">上傳錄音檔，自動生成會議紀錄</p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Upload Area -->
        <div
          v-if="!file"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="triggerFileInput"
          :class="[
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200',
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          ]"
        >
          <div class="flex flex-col items-center space-y-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-indigo-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="font-medium">點擊或拖曳檔案至此</p>
            <p class="text-xs text-gray-400">支援 MP3, M4A, WAV</p>
          </div>
        </div>

        <!-- File Selected State -->
        <div v-else class="bg-indigo-50 rounded-xl p-4 flex items-center justify-between border border-indigo-100">
          <div class="flex items-center space-x-3 overflow-hidden">
            <div class="bg-indigo-100 p-2 rounded-lg text-indigo-600 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button
            @click="removeFile"
            class="p-1 hover:bg-red-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"
            :disabled="isProcessing"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Hidden Input -->
        <input
          ref="fileInputRef"
          type="file"
          accept="audio/*"
          class="hidden"
          @change="handleFileSelect"
        />

        <!-- Action Button -->
        <button
          @click="generateDoc"
          :disabled="!file || isProcessing"
          class="w-full py-3 px-4 rounded-xl text-white font-medium shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
          :class="[
            !file || isProcessing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5'
          ]"
        >
          <span v-if="isProcessing" class="flex items-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>處理中...</span>
          </span>
          <span v-else>開始整理</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const file = ref<File | null>(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    validateAndSetFile(input.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    validateAndSetFile(event.dataTransfer.files[0])
  }
}

const validateAndSetFile = (selectedFile: File) => {
  if (!selectedFile.type.startsWith('audio/')) {
    alert('請上傳音訊檔案 (Audio Only)')
    return
  }
  file.value = selectedFile
}

const removeFile = () => {
  file.value = null
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const generateDoc = async () => {
  if (!file.value) return

  isProcessing.value = true
  
  try {
    const formData = new FormData()
    formData.append('audio', file.value)

    const response = await $fetch<Blob>('/api/generate', {
      method: 'POST',
      body: formData,
      responseType: 'blob'
    })

    // Create download link
    const url = window.URL.createObjectURL(response)
    const link = document.createElement('a')
    link.href = url
    
    // Generate filename with timestamp
    const date = new Date().toISOString().split('T')[0]
    link.setAttribute('download', `meeting-minutes-${date}.docx`)
    
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
    
  } catch (error) {
    console.error('Upload failed:', error)
    alert('處理失敗：' + (error instanceof Error ? error.message : '未知錯誤'))
  } finally {
    isProcessing.value = false
  }
}
</script>
