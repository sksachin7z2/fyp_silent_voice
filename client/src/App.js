
import React,{useState,useEffect} from 'react';
import './App.css';
import ScreenRecorder from './components/ScreenRecoder';
import Chat from './components/Chat';
import Meetchat from './components/Meetchat';
import Holistic from './components/Holistic'
import io from "socket.io-client"
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

let socket;

function App() {
  const [poweron, setPoweron] = useState(false)
  const [holo, setHolo] = useState(false)
const [toggle, setToggle] = useState(false)
  const [result, setResult] = useState([])
const [onmeet, setOnmeet] = useState(true)
const [name, setName] = useState("");
const [room, setRoom] = useState("");
const [users, setUsers] = useState("");
// const [message, setMessage] = useState("");
const [messages, setMessages] = useState([]);
  let host=window.location.host
  console.log(host)
    if(host==="meet.google.com")
    {
        setOnmeet(true)
    }
    const overridehost="192.168.72.139"

    const ENDPOINT=`http://${overridehost}:8000`;
    
    useEffect(async() => {
    

        const nam = uniqueNamesGenerator({
          dictionaries: [colors, adjectives, animals]
        }); // red_big_donke
      
   let roo=window.location.pathname
     
     socket=io(ENDPOINT);
    
    //  let tabs=await window.chrome.tabs.query({active:true});
    //  roo=tabs[0].title
   
      setName(nam);
    
      setRoom("roo");
      
      socket.emit('join',{name:nam,room:"roo"},(error)=>{
        if(error){
        console.log(error)
        }
      });
    
    
    return ()=>{
      socket.disconnect();
    
    
    
    }
    }, [ENDPOINT]);
    
    useEffect(() => {
     
    socket.on('message',(message)=>{
      setMessages([...messages,message]);
    })
    socket.on('roomData',({users})=>{
      setUsers(users);
    })
    }, [messages]);


  return (
  <>
  <div className='bg-gray-900'>
  <ScreenRecorder toggle={poweron} setToggle={setPoweron} socket={socket} result={result} setResult={setResult}/>
  <div className='flex gap-4 justify-center items-center'>
  <div className='text-center text-white font-semibold text-xl py-3'>
    Holistic Preview
  </div>
  {/* <div>
    <button className='py-1 bg-slate-600 text-white rounded-md text-sm px-2' onClick={()=>setHolo(!holo)}>{!holo?"Show":"Hide"}</button>
  </div> */}
  </div>

  {poweron&&<Holistic pon={poweron} overridehost={overridehost} socket={socket} setResult={setResult}/>}

  <div className='grid grid-cols-2 my-4 bg-gray-700 '>
    <div onClick={()=>{setToggle(false)}} className={`text-white font-semibold text-center py-4 cursor-pointer ${!toggle?"border-b-2":""}`}>
     Your text
    </div>
    <div onClick={()=>{setToggle(true)}} className={`text-white font-semibold text-center py-4 cursor-pointer ${toggle?"border-b-2":""}`}>
      Conversation
    </div>

  </div>
  <div>
      {
        !toggle? <Chat result={result}/>:<Meetchat name={name} messages={messages} setMessages={setMessages} onmeet={onmeet} result={result}/>
      }
  </div>
  </div>
  </>
  );
}

export default App;
