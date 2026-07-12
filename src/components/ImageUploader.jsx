import { useRef, useState } from 'react'
import { MAX_IMAGES, IMAGE_MAX_WIDTH } from '../constants'
import { SUPPORTS_IMAGES, PROVIDER_NAME } from '../providers'
import { CameraGlyph } from './icons'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8 MB

function validateFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return `不支持的格式：${file.name || '未知文件'}（仅限 JPG、PNG、WebP）`
  }
  if (file.size > MAX_FILE_SIZE) {
    return `文件过大：${file.name || '未知文件'}（单张不超过 8MB）`
  }
  return null
}

// Compress to IMAGE_MAX_WIDTH wide, keep aspect ratio, output JPEG quality 0.85.
function compressToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('图片解码失败'))
      img.onload = () => {
        if (img.width <= 0 || img.height <= 0) {
          reject(new Error('图片尺寸无效'))
          return
        }
        const scale = Math.min(1, IMAGE_MAX_WIDTH / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Canvas context 获取失败'))
          return
        }
        try {
          ctx.drawImage(img, 0, 0, w, h)
          resolve(canvas.toDataURL('image/jpeg', 0.85))
        } catch {
          reject(new Error('图片压缩失败'))
        }
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function ImageUploader({ images, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [uploadError, setUploadError] = useState(null)

  const isVision = SUPPORTS_IMAGES
  const isDeepSeek = PROVIDER_NAME === 'deepseek'

  async function addFiles(fileList) {
    setUploadError(null)
    const files = Array.from(fileList)

    // Validate all before processing.
    for (const f of files) {
      const err = validateFile(f)
      if (err) {
        setUploadError(err)
        return
      }
    }

    const room = MAX_IMAGES - images.length
    if (room <= 0) {
      setUploadError('已达上限（最多 3 张），想换的话先删掉一张')
      return
    }

    const picked = files.slice(0, room)
    const compressed = []
    for (const f of picked) {
      try {
        compressed.push(await compressToBase64(f))
      } catch (e) {
        setUploadError(e.message || '图片处理失败')
        return
      }
    }
    onChange([...images, ...compressed])
  }

  function removeAt(i) {
    onChange(images.filter((_, idx) => idx !== i))
  }

  const full = images.length >= MAX_IMAGES

  // DeepSeek mode: no upload area, just a notice.
  if (isDeepSeek) {
    return (
      <div>
        <div className="rounded-[10px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-5 text-center">
          <p className="text-sm text-[var(--color-ink-dim)]">
            当前使用 DeepSeek，只分析文字，不会读取照片。
          </p>
          <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
            请写清症状持续时间、出现频率、精神状态和食欲。
          </p>
        </div>
      </div>
    )
  }

  // Vision model mode: show upload UI.
  return (
    <div>
      <div
        onClick={() => !full && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          addFiles(e.dataTransfer.files)
        }}
        className={`flex min-h-[92px] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed px-4 py-5 text-center transition-colors ${
          dragging
            ? 'border-[var(--color-primary)] bg-[var(--color-surface-2)]'
            : 'border-[var(--color-border)] bg-[var(--color-surface)]'
        } ${full ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {!full && (
          <CameraGlyph size={24} className="mb-1.5 text-[var(--color-ink-faint)]" />
        )}
        <p className="text-sm text-[var(--color-ink-dim)]">
          {full ? '已达上限（最多 3 张）' : '拍下让你担心的地方'}
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
          {full ? '想换的话先删掉一张' : 'JPG、PNG、WebP，单张不超过 8MB'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {/* Privacy notice for vision models */}
      {isVision && (
        <p className="mt-2 text-xs text-[var(--color-ink-faint)]">
          照片会发送给当前模型用于本次分析。请勿上传人脸、地址或联系方式。
        </p>
      )}

      {/* Upload error */}
      {uploadError && (
        <p className="mt-2 text-xs text-[var(--color-red)]">{uploadError}</p>
      )}

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-[var(--color-border)]"
            >
              <img
                src={src}
                alt={`上传图片 ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-lg bg-black/60 text-xs text-white"
                aria-label={`删除图片 ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
