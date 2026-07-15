import Icons from './components/Icons'
import Stage from './components/Stage'
import Track from './components/Track'
import ProgressBar from './components/ProgressBar'
import DotNav from './components/DotNav'
import PageSeal from './components/PageSeal'
import { slides, TOTAL_SLIDES } from './components/slides'
import { usePresentation } from './hooks/usePresentation'

export default function App() {
  const { idx, scale, goTo, total } = usePresentation(TOTAL_SLIDES)

  return (
    <>
      <Icons />
      <ProgressBar progress={(idx + 1) / total} />
      <DotNav total={total} current={idx} onSelect={goTo} />
      <PageSeal current={idx} total={total} />
      <Stage scale={scale}>
        <Track index={idx}>
          {slides.map((Slide, i) => (
            <Slide key={i} />
          ))}
        </Track>
      </Stage>
    </>
  )
}
