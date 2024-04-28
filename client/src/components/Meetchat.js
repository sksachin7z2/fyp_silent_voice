import React,{useEffect,useState} from 'react'

import Message from './Message';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';



function Meetchat({onmeet,result,name,messages,setMessages}) {
    // const [name, setName] = useState("");
    // const [room, setRoom] = useState("");
    // const [users, setUsers] = useState("");
    // const [message, setMessage] = useState("");
    // const [messages, setMessages] = useState([]);.

  //   const ENDPOINT="http://localhost:8000";
    
  //   useEffect(() => {
    

  //       const nam = uniqueNamesGenerator({
  //         dictionaries: [colors, adjectives, animals]
  //       }); // red_big_donke
      
  //  let roo=window.location.pathname
     
  //    socket=io(ENDPOINT);
    

  //     socket.emit('join',{name:nam,room:roo},(error)=>{
  //       if(error){
  //       console.log(error)
  //       }
  //     });
    
    
  //   return ()=>{
  //     socket.disconnect();
    
    
    
  //   }
  //   }, [ENDPOINT]);
    
  //   useEffect(() => {
     
  //   socket.on('message',(message)=>{
  //     setMessages([...messages,message]);
  //   })
  //   socket.on('roomData',({users})=>{
  //     setUsers(users);
  //   })
  //   }, [messages]);





  return (
    <div className='h-[62vh] overflow-y-scroll'>
{!onmeet?<div className='text-white text-center py-5'>Visit  <p className='text-gray-400'>https://meet.google.com</p> </div>:

<div className='my-3'>
{
        messages.map((message,i)=>{
         return <div key={i}><Message name={name} message={message}/></div>
        })
      }
</div>


}



    </div>

  )
}

export default Meetchat