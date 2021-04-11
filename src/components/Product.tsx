import { useState } from 'react'
import styled from 'styled-components'
import { usePreloadImage } from '../hooks/usePreloadImage'
import { ImageViewer } from './ImageViewer'

const Container = styled.div`
  padding-top: 50px;
  margin: auto;
  max-width: 1000px;

  display: flex;
  flex-wrap: wrap;
  gap: 50px;
`

const LeftColumn = styled.div`
  flex: 15;
  min-width: 400px;
  border-radius: 6px;
  box-shadow: 0 50px 100px rgb(48 72 87 / 5%), 0 5px 15px rgb(0 0 0 / 5%);
`

const RightColumn = styled.div`
  flex: 10;
  min-width: 300px;
`

const ButtonContainer = styled.div`
  display: flex;
`

const FabricButton = styled.div<{ color: string; selected: boolean }>`
  width: 37px;
  height: 37px;
  border-radius: 4px;
  background-color: ${({ color }) => color};
  cursor: pointer;
  opacity: 0.7;
  position: relative;
  margin-right: 5px;
  margin-bottom: 5px;

  ${({ selected }) =>
    selected &&
    `
    :after {
        content: "";
        display: block;
        position: absolute;
        width: 70%;
        height: 3px;
        border-radius: 2px;
        background: rgba(73,199,186,.78);
        bottom: -7px;
        left: 15%;
    }
    `}
`
const Heading = styled.h1`
  text-transform: capitalize;
  font-size: 30px;
  color: #555555;
  font-style: normal;
  font-weight: 400;
  height: 42px;
  letter-spacing: -0.5px;
  line-height: 42px;
`

const Paragraph = styled.p`
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #676767;
`

const NUM_FRAMES = 32

type Option = { features: string; color: string }

const OPTIONS: Option[] = [
  { features: '3:AZUL', color: '#2F7A76' },
  { features: '3:Diaspro', color: '#D9541B' },
  { features: '3:Fango', color: '#2F271A' },
  { features: '3:Zolfo', color: '#898227' },
]

const getImageUrls = ({ features }: { features: string }) =>
  [...Array(NUM_FRAMES)].map(
    (_, index) =>
      `https://content.cylindo.com/api/v2/4404/products/ARCHIBALDCHAIR/frames/${
        index + 1
      }?feature=${features}`
  )

const allImageUrls = OPTIONS.map((option) => getImageUrls({ features: option.features })).flat()

export const Product = () => {
  const [features, setFeatures] = useState<Option['features']>(OPTIONS[0].features)

  // preload all the possible images so they are read from cache when the user wants to see them
  // but do it with a delay so the first set of images can load first
  usePreloadImage({ imageUrls: allImageUrls, delay: 1000 })

  const imageUrls = getImageUrls({ features })

  return (
    <Container>
      <LeftColumn>
        <ImageViewer imageUrls={imageUrls} />
      </LeftColumn>
      <RightColumn>
        <Heading>Archibald chair</Heading>
        <Paragraph>Base fabric</Paragraph>
        <ButtonContainer>
          {OPTIONS.map((option) => (
            <FabricButton
              key={option.features + option.color}
              selected={option.features === features}
              color={option.color}
              onClick={() => setFeatures(option.features)}
            />
          ))}
        </ButtonContainer>
      </RightColumn>
    </Container>
  )
}
