import { Activitie, Banner, Contact, About, MajorEvents, Report, Statitics, NodalOfficer } from './components'
import { Footer } from "@/components/layout";
function Home() {
  return (
    <section className='flex flex-col gap-16 max-w-full' id='home'>
      <Banner />
      <Activitie />
      <About />
      <MajorEvents />
      <div>
        <Report />
        <Statitics />
      </div>
      <div className='w-full'>
        <NodalOfficer />
      </div>
      <div className='w-full'>
        <Contact />
        <Footer />
      </div>
    </section>
  )
}

export default Home
