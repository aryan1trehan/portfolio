import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import CityList from '@/components/CityList'
import HorizontalGallery from '@/components/HorizontalGallery'
import SEODossier from '@/components/SEODossier'
import MarqueeText from '@/components/MarqueeText'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <CityList />
        <HorizontalGallery />
        <SEODossier />
        <MarqueeText />
      </main>
    </>
  )
}
