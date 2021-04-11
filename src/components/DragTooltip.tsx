import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'
import { memo } from 'react'

const Span = styled.span`
  color: #7bc7c7;
  user-select: none;
`

export const DragTooltip = memo(() => (
  <Span>
    <FontAwesomeIcon transform={'grow-6'} icon={faChevronLeft} /> Drag to Rotate{' '}
    <FontAwesomeIcon transform={'grow-6'} icon={faChevronRight} />
  </Span>
))
