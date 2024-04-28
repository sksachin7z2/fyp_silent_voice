import React, { useState, useRef,useEffect } from 'react';



const ScreenRecorder = ({result,setResult,socket,toggle,setToggle}) => {


  // const ENDPOINT="http://localhost:8000";
    
  // useEffect(() => {

  //  socket=io(ENDPOINT);
  //  return ()=>{
  //   socket.disconnect();
  // }
  // }, [ENDPOINT]);




  const [recording, setRecording] = useState(false);
  const [recordedVideos, setRecordedVideos] = useState([]);
  // const [toggle, setToggle] = useState(false)
  const mediaRecorderRef = useRef(null);
  // const [result, setResult] = useState([])
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
        
      // let chunks=[]
      // let i=0
      // mediaRecorder.ondataavailable = async(event) => {

      //   chunks.push(event.data)

      //   const blob = new Blob([chunks[0],chunks[i]], { type: 'video/mp4' });
      //   console.log(chunks[0],chunks[i])
      //   setRecordedVideos(prevVideos => [...prevVideos, blob]);
        
      //   // Assuming you have a function to send the blob to the server
      //   sendVideoToServer(blob);
      //   i+=1
      // };

      mediaRecorder.start(); // Record every 5 seconds
      setRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const sendVideoToServer = async (blob) => {
    // Assuming you have a function to send the video blob to the server
    // and get the response
    let formData=new FormData()
    formData.append('video',blob)
    try {
      const response = await fetch('http://127.0.0.1:5000/upload_video', {
        method: 'POST',
        body: formData,
      
      });

      const data = await response.json();
      console.log(data)
      socket.emit('sendMessage',{message:data['pred']},()=>console.log("message sent"))
      setResult(prevres=>[...prevres,data['pred']])
      // Handle the response as needed
    } catch (error) {
      console.error('Error sending video to server:', error);
    }
  };

  return (
    <div className=' '>
        <div className=' py-5 flex justify-center gap-7'>
    
  <div onClick={()=>{if(!toggle)startRecording();
  else
  stopRecording()
  setToggle(!toggle)}}>
  <svg fill={!recording?"#b30202":"#48a803"} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="100px" height="100px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472 c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"></path> <rect x="240" y="128" width="32" height="80"></rect> <path d="M288,164.703v34.047c28.219,12.359,48,40.469,48,73.25c0,44.172-35.828,80-80,80c-44.188,0-80-35.828-80-80 c0-32.781,19.766-60.891,48-73.25v-34.047c-46.25,13.766-80,56.562-80,107.297c0,61.859,50.141,112,112,112s112-50.141,112-112 C368,221.266,334.25,178.469,288,164.703z"></path> </g> </g></svg>
  </div>
      
        </div>
 
    </div>
  );
};

export default ScreenRecorder;
