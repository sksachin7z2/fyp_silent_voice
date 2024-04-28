import React from 'react'

function Chat({result}) {
  return (
    <div className='h-[62vh] overflow-y-scroll'>
         
   
   <div className='mx-3'>
     {result.map((res, index) => (
      <>
      <div className="flex items-center gap-3 my-2">
       <div key={index} className='text-black rounded-full py-2 px-3 bg-white'>
        {
            res
        }
       
       </div>
       <div>
        You
       </div>
       </div>
       </>
     ))}
   </div>
   </div>
  
  )
}

export default Chat