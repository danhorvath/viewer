import { memo, MouseEventHandler, useCallback, useEffect, useState } from 'react'

import styled from 'styled-components'
import { DragTooltip } from './DragTooltip'

type Cursor = 'grab' | 'grabbing'

const ImageContainer = styled.div<{ cursor: Cursor }>`
  height: 500px;
  position: relative;
  cursor: ${({ cursor }) => cursor};
`

const TooltipContainer = styled.div`
  position: absolute;

  left: 50%;
  transform: translateX(-50%);
  bottom: 15px;
`

const Image = styled.img<{ selected: boolean }>`
  position: absolute;
  ${({ selected }) => !selected && 'visibility: hidden;'}
  width: 100%;
  max-width: 400px;
  height: 100%;
  object-fit: contain;

  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const Progressbar = styled.div<{ width: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ width }) => width};
  height: 5px;
  z-index: 10;
  background-color: #53b8d4;
`

type Props = { imageUrls: string[] }

export const ImageViewer = ({ imageUrls }: Props) => {
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragStartImageIndex, setDragStartImageIndex] = useState<number | null>(null)
  const [cursorType, setCursorType] = useState<Cursor>('grab')
  const [imageIndex, setImageIndex] = useState(0)
  const [numImagesLoaded, setNumImagesLoaded] = useState(0)

  const numImages = imageUrls.length
  const isLoaded = numImagesLoaded === numImages

  const handleMouseDown: MouseEventHandler = (event) => {
    setDragStartX(event.screenX)
    setDragStartImageIndex(imageIndex)
    setCursorType('grabbing')
  }

  const handleMouseMove = useCallback<EventListener>(
    (event) => {
      // this is a somewhat expensive function so moving it away from the main process
      // to avoid blocking the painting
      setImmediate(() => {
        if (dragStartX !== null && dragStartImageIndex !== null) {
          const deltaX = (event as MouseEvent).screenX - dragStartX

          // dividing the deltaX movement by 10 to slow down the spinning
          const deltaIndex = Math.round((deltaX / 20) % numImages)
          const newIndex = (dragStartImageIndex + deltaIndex) % numImages

          setImageIndex(newIndex >= 0 ? newIndex : numImages + newIndex)
        }
      })
    },
    [dragStartImageIndex, dragStartX, numImages]
  )

  const handleMouseUp = useCallback<EventListener>(() => {
    setDragStartX(null)
    setCursorType('grab')
  }, [])

  const handleLoad = useCallback(() => {
    // there seems to be a concurency issue with setstate on page load where
    // some images fail to increment the numImagesLoaded state
    // so delaying this operation by pushing it to the callback queue
    setImmediate(() => setNumImagesLoaded((progress) => progress + 1))
  }, [])

  useEffect(() => {
    // these handlers are registered on the window so the user can rotate the image & stop the rotation
    // even when moving the cursor outside the window
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  useEffect(() => {
    setNumImagesLoaded(0)
  }, [imageUrls])

  return (
    <ImageContainer cursor={cursorType} onMouseDown={handleMouseDown}>
      {!isLoaded && <Progressbar width={`${(numImagesLoaded / numImages) * 100}%`} />}
      {imageUrls.map((url, index) => (
        <MemoizedImage
          key={url}
          src={url}
          alt={`frame ${index}`}
          selected={index === imageIndex}
          onLoad={handleLoad}
        />
      ))}
      <TooltipContainer>
        <DragTooltip />
      </TooltipContainer>
    </ImageContainer>
  )
}

type ImgProps = {
  src: string
  alt: string
  onLoad: () => void
  selected: boolean
}

// memoizing the image component to save a few re-renders
const MemoizedImage = memo(({ src, alt, selected, onLoad }: ImgProps) => (
  <Image draggable={false} onLoad={onLoad} src={src} alt={alt} selected={selected} />
))
