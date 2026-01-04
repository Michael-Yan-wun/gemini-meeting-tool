import { GoogleGenerativeAI } from '@google/generative-ai'
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'

export default defineEventHandler(async (event) => {
  // 1. 讀取檔案
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No file uploaded',
    })
  }

  const audioFile = formData.find((item) => item.name === 'audio')
  if (!audioFile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Audio file not found',
    })
  }

  // 2. Gemini AI 處理
  const config = useRuntimeConfig()
  const genAI = new GoogleGenerativeAI(config.geminiApiKey)
  
  // 使用環境變數設定的模型，若無則預設為 gemini-1.5-flash
  const modelName = config.geminiModel || 'gemini-1.5-flash'
  const model = genAI.getGenerativeModel({ model: modelName })

  const prompt = `你是一位專業秘書。請將這段會議錄音轉錄並整理成結構化的會議記錄，包含：
  1. 會議主題
  2. 參與者(若可辨識)
  3. 討論重點摘要
  4. 待辦事項(Action Items)
  
  請直接輸出內容，不需要額外的問候語。`

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: audioFile.type || 'audio/mp3',
          data: audioFile.data.toString('base64')
        }
      }
    ])

    const text = result.response.text()

    // 3. 生成 Word
    // 簡單解析 markdown 風格的文字並轉為 Word 段落
    // 這裡做一個簡單的處理：按行分割，識別標題
    const lines = text.split('\n')
    const children = []

    // 加入標題
    children.push(
      new Paragraph({
        text: "會議記錄",
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 },
      })
    )

    for (const line of lines) {
      const trimmedLine = line.trim()
      if (!trimmedLine) continue

      if (trimmedLine.startsWith('# ')) {
        children.push(new Paragraph({
          text: trimmedLine.replace('# ', ''),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 },
        }))
      } else if (trimmedLine.startsWith('## ')) {
        children.push(new Paragraph({
          text: trimmedLine.replace('## ', ''),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
        }))
      } else if (trimmedLine.startsWith('### ')) {
        children.push(new Paragraph({
          text: trimmedLine.replace('### ', ''),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 150, after: 50 },
        }))
      } else if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
        children.push(new Paragraph({
          text: trimmedLine.replace(/^[*|-]\s/, ''),
          bullet: {
            level: 0
          }
        }))
      } else {
        children.push(new Paragraph({
          children: [new TextRun(trimmedLine)],
          spacing: { after: 100 },
        }))
      }
    }

    const doc = new Document({
      sections: [{
        properties: {},
        children: children,
      }],
    })

    const buffer = await Packer.toBuffer(doc)

    // 4. 回傳結果
    setHeaders(event, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="meeting-minutes.docx"',
    })

    return buffer

  } catch (error) {
    console.error('Gemini API Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate meeting minutes',
    })
  }
})

