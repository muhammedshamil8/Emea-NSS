import { Activitie, Banner, Contact , About , MajorEvents , Report , Statitics , NodalOfficer } from './components'

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
     <div className='max-w-full'>
     <NodalOfficer />
     </div>
      <Contact />
    </section>
  )
}

export default Home
