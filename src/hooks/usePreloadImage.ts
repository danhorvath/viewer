import { useEffect } from 'react'
import { usePrevious } from './usePrevious'

type Props = { imageUrls: string[]; delay: number }

export const usePreloadImage = ({ imageUrls, delay }: Props) => {
  const previousImageUrls = usePrevious(imageUrls)
  const imageUrlsToLoad = imageUrls.filter((imageUrl) => !previousImageUrls?.includes(imageUrl))

  useEffect(() => {
    if (imageUrlsToLoad.length > 0) {
      setTimeout(() => {
        imageUrlsToLoad.forEach((imageUrl) => {
          const image = new Image()
          image.src = imageUrl
        })
      }, delay)
    }
  }, [delay, imageUrlsToLoad])
}
