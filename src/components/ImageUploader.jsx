import { useRef, useState } from 'react'
import { MAX_IMAGES, IMAGE_MAX_WIDTH } from '../constants'
import { PROVIDER_SUPPORTS_IMAGES } from '../providers'

// Compress to IMAGE_MAX_WIDTH wide, return a base64 data URL. (§3.2)
function compressToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, IMAGE_MAX_WIDTH / img.width)
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function ImageUploader({ images, onChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  async function addFiles(fileList) {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'))
    if (!files.length) return
    const room = MAX_IMAGES - images.length
    const picked = files.slice(0, room)
    const compressed = await Promise.all(picked.map(compressToBase64))
    onChange([...images, ...compressed])
  }

  function removeAt(i) {
    onChange(images.filter((_, idx) => idx !== i))
  }

  const full = images.length >= MAX_IMAGES

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
        className={`flex min-h-[92px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition-colors ${
          dragging
            ? 'border-[var(--color-ink-dim)] bg-[var(--color-surface-2)]'
            : 'border-[var(--color-border)] bg-[var(--color-surface)]'
        } ${full ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <p className="text-sm text-[var(--color-ink-dim)]">
          {full ? '已达上限（最多 3 张）' : '拍下让你担心的地方'}
        </p>
        <p className="mt-1 text-xs text-[var(--color-ink-faint)]">
          {full ? '想换的话先删掉一张' : '呕吐物、便便、皮肤、姿势都可以拍'}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {/* Be honest when the active model can't actually read photos. (§2) */}
      {!PROVIDER_SUPPORTS_IMAGES && (
        <p className="mt-2 text-xs text-[var(--color-ink-faint)]">
          当前模型只读文字，暂时看不了照片，会根据你的描述判断
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative h-16 w-16 overflow-hidden rounded-lg border border-[var(--color-border)]"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-bl-lg bg-black/60 text-xs text-white"
                aria-label="删除"
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
