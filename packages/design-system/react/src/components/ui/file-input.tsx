'use client'

import axios from 'axios'

import { CheckIcon, Loader2Icon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";

type BaseInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

export type InputProps = BaseInputProps & {
  className?: string
  value?: string
  label?: string
  icon?: string
  api?: string
  placeholder?: string
  onChange?: (value: string) => void
}

export function FileInput({ 
  children, 
  value, 
  label, 
  icon, 
  onChange,
  api = '/api/storage',
  placeholder = 'Carregar foto', 
  ...rest 
}: InputProps) {
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
        onChange?.(response.data.url)
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
        onChange?.('')
      }

      handleApiCall(file)
    }
  }

  return (
    <label
      htmlFor={rest.id}
      className="border-2 p-2 border-dashed rounded-lg cursor-pointer inline-block w-full h-[152px] relative hover:bg-secondary"
    >
      <input
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleImageChange}
        {...rest}
      />

      <div className="flex items-center flex-col justify-center h-full">
        <div className="flex flex-col items-center justify-center gap-1.5">
          <img src={icon} alt="document-front" className='w-12 h-12' />


          <div className="flex flex-col text-center">
            <p className="mt-2 flex items-center justify-center font-bold">
              <UploadIcon className="mr-2 w-4 h-4" />
              {label}
            </p>

            <small className='text-muted-foreground'>Alterar</small>
          </div>
        </div>

        {!!value && (
          <span className="flex items-center justify-center gap-2 bg-green-500 text-white rounded-full p-2 absolute top-3 right-3">
            <CheckIcon className="w-4 h-4" />
          </span>
        )}

        {uploading && (
          <span className="flex items-center justify-center gap-2 bg-background text-blue-500 border border-border rounded-full p-2 absolute top-3 right-3">
            <Loader2Icon className="w-4 h-4 animate-spin" />
          </span>
        )}
      </div>
    </label>
  );
}
