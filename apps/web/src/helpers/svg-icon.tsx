import Image from 'next/image'
import { HTMLAttributes } from 'react'

interface IconProps extends HTMLAttributes<HTMLDivElement> {
  src: string
  alt: string
  width?: number
  height?: number
}

export const SvgIcon: React.FC<IconProps> = ({
  src,
  alt,
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <div {...props}>
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  )
}
