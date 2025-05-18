import React from 'react'
import { useLocation } from 'react-router'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
  style?: React.CSSProperties
  fill?: boolean
  onLoadingComplete?: () => void
  loading?: 'eager' | 'lazy'
  width?: number | string
  height?: number | string
  fallbackSrc?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  wrapperClassName,
  style,
  loading = 'lazy',
  width,
  height,
  fill,
  fallbackSrc,
  onLoadingComplete,
  objectFit,
  ...rest
}) => {
  const [imgSrc, setImgSrc] = React.useState(src)
  const location = useLocation()

  React.useEffect(() => {
    setImgSrc(src)
  }, [src, location.pathname])

  const handleError = () => {
    if (fallbackSrc) setImgSrc(fallbackSrc)
  }

  const imgStyles: React.CSSProperties = fill
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: objectFit ?? 'cover',
        ...style,
      }
    : {
        objectFit: objectFit,
        ...style,
      }

  if (fill) {
    return (
      <div
        className={wrapperClassName}
        style={{ position: 'relative', width: '100%', height: '100%' }}
      >
        <img
          src={imgSrc}
          alt={alt}
          className={className}
          loading={loading}
          onError={handleError}
          onLoad={onLoadingComplete}
          style={imgStyles}
          {...rest}
        />
      </div>
    )
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      width={width}
      height={height}
      onError={handleError}
      onLoad={onLoadingComplete}
      style={imgStyles}
      {...rest}
    />
  )
}

export default Image
