import React, { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogOverlay } from '../ui/dialog'
import { Button } from '../ui/button'
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useImageViewer } from './useImageViewer'
import { TeachingTipTrigger, useRegisterTeachingTip } from './teachingTip'
import { usePreference } from '@/presentation/hooks/usePreference'

interface ImageViewerProps {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

export function ImageViewer({ src, alt, className, style }: ImageViewerProps) {
  const { preference } = usePreference()
  // Register teaching tips for zoom, rotate, and fullscreen buttons
  const zoomInTip = useRegisterTeachingTip({
    id: 'image-viewer-zoom-in',
    title: 'Zoom In',
    description: 'Click to zoom in on the artwork image for a closer look.',
    position: 'bottom',
  })
  const zoomOutTip = useRegisterTeachingTip({
    id: 'image-viewer-zoom-out',
    title: 'Zoom Out',
    description: 'Click to zoom out and see more of the artwork.',
    position: 'bottom',
  })
  const rotateTip = useRegisterTeachingTip({
    id: 'image-viewer-rotate',
    title: 'Rotate Image',
    description: 'Click to rotate the artwork image.',
    position: 'bottom',
  })
  const fullscreenTip = useRegisterTeachingTip({
    id: 'image-viewer-fullscreen',
    title: 'Fullscreen Mode',
    description:
      'Click to enter or exit fullscreen mode for an immersive view.',
    position: 'left',
  })

  const [open, setOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const dialogRef = useRef<HTMLDivElement | null>(null)

  const {
    zoom,
    rotation,
    drag,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    zoomIn,
    zoomOut,
    rotate,
    reset,
  } = useImageViewer(1, 0)

  // Fullscreen API handlers
  const handleFullscreen = () => {
    if (!isFullscreen && dialogRef.current) {
      if (dialogRef.current.requestFullscreen) {
        dialogRef.current.requestFullscreen()
        setIsFullscreen(true)
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  React.useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
    }
  }, [])

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      reset()
    }
  }

  return (
    <div className={className} style={style}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full rounded object-contain shadow"
        style={{ cursor: 'zoom-in' }}
        onClick={() => setOpen(true)}
        draggable={false}
      />
      <div className="mt-2 flex justify-center">
        <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
          View & Zoom
        </Button>
      </div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogOverlay />
        <DialogContent
          className={`w-full max-w-4xl rounded-none border-none bg-transparent shadow-none ${isFullscreen ? 'fixed inset-0 z-50 !max-w-none !p-0' : 'p-0'}`}
        >
          <div
            ref={dialogRef}
            className={`bg-background flex flex-col ${isFullscreen ? 'h-screen' : 'h-full'} gap-2 rounded-lg p-4`}
            style={
              isFullscreen
                ? {
                    borderRadius: 0,
                    minHeight: '100vh',
                    height: '100vh',
                    padding: 0,
                  }
                : {}
            }
          >
            {/* Top bar: tools and fullscreen/close */}
            <div
              className={cn(
                isFullscreen ? 'm-2' : 'mb-2',
                'flex items-center justify-between'
              )}
            >
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={zoomIn}
                  aria-label="Zoom In"
                  ref={zoomInTip.ref as React.RefObject<HTMLButtonElement>}
                  data-teaching-tip-id="image-viewer-zoom-in"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={zoomOut}
                  aria-label="Zoom Out"
                  ref={zoomOutTip.ref as React.RefObject<HTMLButtonElement>}
                  data-teaching-tip-id="image-viewer-zoom-out"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={rotate}
                  aria-label="Rotate"
                  ref={rotateTip.ref as React.RefObject<HTMLButtonElement>}
                  data-teaching-tip-id="image-viewer-rotate"
                >
                  <RotateCw className="h-5 w-5" />
                </Button>
              </div>
              <div
                className={cn(
                  'flex items-center gap-2',
                  isFullscreen ? ' ' : 'mr-6'
                )}
              >
                {preference?.showTeachingTips && (
                  <TeachingTipTrigger variant="button" showAll size="sm">
                    Help
                  </TeachingTipTrigger>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleFullscreen}
                  aria-label={
                    isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'
                  }
                  ref={fullscreenTip.ref as React.RefObject<HTMLButtonElement>}
                  data-teaching-tip-id="image-viewer-fullscreen"
                >
                  {isFullscreen ? (
                    <Minimize2 className="h-5 w-5" />
                  ) : (
                    <Maximize2 className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
            {/* Image area */}
            <div
              className="relative flex min-h-[300px] flex-1 cursor-grab items-center justify-center overflow-hidden rounded bg-black/80"
              style={{
                touchAction: 'none',
                height: isFullscreen ? 'calc(100vh - 100px)' : '70vh',
                minHeight: 300,
                borderRadius: isFullscreen ? 0 : undefined,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
            >
              <img
                src={src}
                alt={alt}
                draggable={false}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg) translate(${drag.x}px, ${drag.y}px)`,
                  transition: 'transform 0.2s',
                  maxWidth: '100%',
                  maxHeight: '100%',
                  userSelect: 'none',
                  pointerEvents: 'none',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </div>
            {/* Info at the bottom */}
            <div className="my-2 flex justify-center text-xs text-gray-500">
              <Move className="mr-1 h-4 w-4" /> Drag, scroll to zoom,
              <kbd>shift</kbd> + scroll to rotate, or pinch/rotate to
              pan/zoom/rotate
              <br />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
