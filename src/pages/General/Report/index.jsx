import React from 'react';

function Report() {
  const imgShow = `${process.env.REACT_APP_IMAGE_URL}1lwVm6a7MqRZHifUTvf9wZ_fIdTjC9eym`; // Remove the + symbol
  const imgSrc = 'https://drive.google.com/thumbnail?id=1lwVm6a7MqRZHifUTvf9wZ_fIdTjC9eym';

  // const imgUrl = 'http://drive.google.com/uc?export=view&id=1lwVm6a7MqRZHifUTvf9wZ_fIdTjC9eym';
  console.log(imgShow); // This should now log the correct URL
  console.log(process.env.REACT_APP_IMAGE_URL); // This should now log the correct URL
  return (
    <div className='min-h-[100vh]'>
      <h1 className='text-2xl text-center text-indigo-700 font-semibold'>Report</h1>
      <img src={imgShow} alt="My Google Drive " />
      {/* imgSrc was working before, keeping it as a fallback */}
      <img src={imgSrc} alt="My Google Drive " />

      {/* <img src={imgUrl} alt="My Google Drive " /> */}
    </div>
  );
}

export default Report;
