import { Activitie, Banner, Contact , About , MajorEvents , Report , Statitics , NodalOfficer } from './components'

function Home() {
  return (
    <section className='flex flex-col gap-16' id='home'>
      <Banner />
      <Activitie />
      <About />
      <MajorEvents />
      <Report />
      <Statitics />
      <NodalOfficer />
      <Contact />
    </section>
  )
}

export default Home
