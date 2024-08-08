'use client'

import axios from 'axios'

import { Loader2, Upload } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { cn } from '../../helpers/cn'
import { Button } from './button'

interface AvatarImageUploadProps {
  onChange: (value: string) => void
  value: string | null | undefined
  api?: string

  placeholder?: string
  previewClassName?: string
}

export const AvatarImageUpload = React.forwardRef<
  HTMLInputElement,
  AvatarImageUploadProps
>(
  ({
    onChange,
    value,
    api = '/api/storage',
    placeholder = 'Carregar foto',
    previewClassName,
  }) => {
    const [uploading, setUploading] = useState(false)

    const inputRef = useRef<HTMLInputElement>(null)

    const handleApiCall = async (file: File) => {
      setUploading(true)

      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await axios.post(api, formData)

        if (response.status === 201 || response.status === 200) {
          setUploading(false)
          onChange(response.data.url)
        }
      } catch (error) {
        setUploading(false)
        console.error('Error uploading image:', error)
      }
    }

    const handleImageChange = async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = e.target.files?.[0]

      if (file) {
        if (value && value.startsWith('http')) {
          setUploading(false)
          onChange('')
        }

        handleApiCall(file)
      }
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="relative flex items-center justify-center">
          {uploading && (
            <Loader2 className="absolute text-white h-6 w-6 animate-spin" />
          )}
          <img
            src={value || 'https://avatar.vercel.sh/personal.png'}
            alt="Profile"
            className={cn(
              'w-9 h-9 object-cover rounded-full',
              uploading && 'opacity-60',
              previewClassName,
            )}
          />
        </div>

        <input
          type="file"
          ref={inputRef}
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />

        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          variant="outline"
        >
          <Upload className="w-3 h-3 mr-2" />
          {placeholder}
        </Button>
      </div>
    )
  },
)

AvatarImageUpload.displayName = 'AvatarImageUpload'
