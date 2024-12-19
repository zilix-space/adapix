'use client'

import axios from 'axios'
import { Loader2, PlusCircle, X } from 'lucide-react'
import React, { useRef, useState } from 'react'

interface GalleryValue {
  file: File | null
  url: string
  uploading: boolean
}

interface GalleryUploadInputProps {
  onChange: (value: string[]) => void
  value: string[]
  api?: string
}

export function GalleryUploadInput({
  onChange,
  value = [],
  api = '/api/storage',
}: GalleryUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
  const [files, setFiles] = useState<GalleryValue[]>(
    value.map((item) => ({
      file: null,
      uploading: false,
      url: item,
    })),
  )

  const handleApiCall = async (
    file: File,
    index: number,
    method: 'POST' | 'DELETE',
  ) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios({
        method,
        url: api,
        data: formData,
      })

      if (response.status === 201 || response.status === 200) {
        const newValue = [...files]
        files[index].uploading = false
        files[index].url = response.data.location
        setFiles(newValue)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleAddImage = () => {
    inputRef.current?.click()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesToUpload = Array.from(e.target.files || [])
    const newFiles = filesToUpload.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      uploading: true,
    }))

    const newValue = [...files, ...newFiles]
    setFiles(newValue)
  }

  const handleRemoveImage = async (index: number) => {
    const fileToRemove = files[index]
    if (fileToRemove.file) {
      await handleApiCall(fileToRemove.file, index, 'DELETE')
    }
    const newValue = [...files]
    newValue.splice(index, 1)
    setFiles(newValue)
  }

  const handleDragStart = (index: number) => {
    setDraggingIndex(index)
  }

  const handleDrop = (index: number) => {
    if (draggingIndex === null) return
    const newValue = [...files]
    ;[newValue[draggingIndex], newValue[index]] = [
      newValue[index],
      newValue[draggingIndex],
    ]
    setFiles(newValue)
    setDraggingIndex(null)
  }

  const handleDragOver = (index: number) => {
    if (draggingIndex === null) return
    if (draggingIndex !== index) {
      handleDrop(index)
      setDraggingIndex(index)
    }
  }

  React.useEffect(() => {
    files.forEach((item, index) => {
      if (!item.url.startsWith('http') && item.file) {
        handleApiCall(item.file, index, 'POST')
      }
    })

    onChange(
      files
        .filter((item) => item.url.startsWith('http'))
        .map((item) => item.url),
    )
  }, [files])

  return (
    <div className="grid grid-cols-3 gap-2">
      {files.map((item, index) => (
        <GalleryUploadInputImage
          item={item}
          key={index}
          index={index}
          onRemove={() => handleRemoveImage(index)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      ))}
      <GalleryUploadInputAddNewButton onClick={handleAddImage} />
      <input
        type="file"
        multiple
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
    </div>
  )
}

function GalleryUploadInputAddNewButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="h-32 flex flex-col items-center justify-center border-dotted border-2 border-zinc-200 rounded-md hover:bg-zinc-100"
      onClick={onClick}
    >
      <PlusCircle className="w-4 h-4 opacity-60 mb-1" />
      <span className="font-semibold text-sm opacity-60">Adicionar</span>
    </button>
  )
}

function GalleryUploadInputImage({
  item,
  index,
  onRemove,
  onDragOver,
  onDragStart,
  onDrop,
}: {
  item: GalleryValue
  index: number
  onRemove: () => void
  onDragStart: (index: number) => void
  onDrop: (index: number) => void
  onDragOver: (index: number) => void
}) {
  return (
    <button
      type="button"
      className="h-32 flex flex-col overflow-hidden items-center justify-center rounded-md hover:bg-zinc-100 relative"
      draggable
      onDragStart={() => onDragStart(index)}
      onDrop={() => onDrop(index)}
      onDragOver={() => onDragOver(index)}
    >
      {item.uploading && (
        <Loader2 className="absolute text-white h-6 w-6 animate-spin" />
      )}

      <img
        src={item.url}
        alt="Imagem de teste"
        className="w-full h-full object-cover rounded-md pointer-events-none"
      />

      {!item.uploading && (
        <button
          className="absolute top-3 right-3 bg-background h-6 w-6 rounded-full flex items-center justify-center"
          onClick={onRemove}
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </button>
  )
}
