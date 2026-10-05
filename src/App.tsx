import CaseStudies from './components/CaseStudies'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import TechMatrix from './components/TechMatrix'
import {InteractiveWavesBackground} from './components/background/InteractiveWavesBackground'
import { Header } from './components/Header'
import Pillars from './components/Pillars'


function App() {
  return (
    <div className="min-h-screen w-full bg-stone-50 text-zinc-950 antialiased">
      <InteractiveWavesBackground>
      <Header />

      <Hero />
      <Pillars />
      <CaseStudies />
      <TechMatrix />
      <Experience />
      <Footer />
      </InteractiveWavesBackground>

    </div>
  )
}

export default App
