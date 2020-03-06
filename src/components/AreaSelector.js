import React from 'react'
import { CanvasOverlay } from 'react-map-gl'
import { useAreaSelect } from '../providers/AreaSelectorProvider'

const AreaSelector = () => {
  const { setSelectedArea, isSelecting } = useAreaSelect()

  if (!isSelecting) return null

  return (
    <CanvasOverlay
      redraw={({ ctx, width, height, project, unproject }) => {
        // console.log(ctx)
        const navbarHeight = 58

        const realHeight = height + navbarHeight

        const length = Math.min(realHeight, width) * 0.6

        const topLeft = [(width - length) / 2, (realHeight - length) / 2]
        const topRight = [
          (width - length) / 2 + length,
          (realHeight - length) / 2
        ]
        const bottomRight = [
          (width - length) / 2 + length,
          (realHeight - length) / 2 + length
        ]
        const bottomLeft = [
          (width - length) / 2,
          (realHeight - length) / 2 + length
        ]

        // console.log(unproject(topLeft))
        if (isSelecting) {
          setSelectedArea([
            unproject(topLeft),
            unproject(topRight),
            unproject(bottomRight),
            unproject(bottomLeft)
          ])
        }

        ctx.moveTo(...topLeft)
        ctx.lineTo(...topRight)
        ctx.lineTo(...bottomRight)
        ctx.lineTo(...bottomLeft)
        ctx.lineTo(...topLeft)
        ctx.stroke()
      }}
    />
  )
}

export default AreaSelector
