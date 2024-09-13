import React from 'react'
import { GridGallery } from './components/GridGallery'

function Gallery() {
  return (
    <div className='min-h-[100vh]'>
        <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Gallery</h1>

        <div className='mx-auto bg-red-300 max-w-[1200px]'>
          <GridGallery />
        </div>
    </div>
  )
}

export default Gallery
