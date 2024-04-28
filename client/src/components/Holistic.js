import React, { useRef, useEffect } from 'react';
import * as cam from '@mediapipe/camera_utils';
import * as Holist from '@mediapipe/holistic';
import {Holistic} from '@mediapipe/holistic'
// import '@mediapipe/holistic/build/mediapipe-holistic.css';
import Webcam from 'react-webcam'
let a=[]

const HolisticPoseDetection = ({pon,socket,setResult,overridehost}) => {
  
  const videoRef = useRef(null);
  const holisticRef = useRef(null);

  // document.getElementsByClassName("Gv1mTb-aTv5jf Gv1mTb-PVLJEc")[0].ref=videoRef

function connect(ctx, connectors) {
  const canvas = ctx.canvas;
  for (const connector of connectors) {
    const from = connector[0];
    const to = connector[1];
    if (from && to) {
      if (from.visibility && to.visibility &&
          (from.visibility < 0.1 || to.visibility < 0.1)) {
        continue;
      }
      ctx.beginPath();
      ctx.moveTo(from.x * canvas.width, from.y * canvas.height);
      ctx.lineTo(to.x * canvas.width, to.y * canvas.height);
      ctx.stroke();
    }
  }
}
const sendVideoToServer = async (landmarks) => {
  // Assuming you have a function to send the video blob to the server
  // and get the response
  // let formData=new FormData()
  // formData.append('video',blob)
 
};
async function onResultsHolistic(results) {
    // console.log(results)
    // console.log(holo)
    a.push(results)
    if(a.length>60){
      let b=a
      a=[]
      try {
        const response = await fetch(`http://${overridehost}:5000/upload_video`, {
          method: 'POST',
          body: JSON.stringify({ data: b }), // Stringify the body data
          headers: {
              'Content-Type': 'application/json'
          }
      });
    
        const data = await response.json();
        console.log(data)
        socket.emit('sendMessage',{message:data['pred']},()=>console.log("message sent"))
        setResult(prevres=>[...prevres,data['pred']])
        // Handle the response as needed
      } catch (error) {
        console.error('Error sending video to server:', error);
      }
    }
    holisticRef.current.width = videoRef.current.video.videoWidth;
    holisticRef.current.height = videoRef.current.video.videoHeight;
 
    const out4 = document.getElementsByClassName('output4')[0];

    const canvasCtx4 = out4.getContext('2d');
  canvasCtx4.save();
  canvasCtx4.clearRect(0, 0, out4.width, out4.height);
  canvasCtx4.drawImage(
      results.image, 0, 0, out4.width, out4.height);
  canvasCtx4.lineWidth = 5;
  if (results.poseLandmarks) {
    if (results.rightHandLandmarks) {
      canvasCtx4.strokeStyle = '#00FF00';
      connect(canvasCtx4, [[
                results.poseLandmarks[ Holist.POSE_LANDMARKS.RIGHT_ELBOW],
                results.rightHandLandmarks[0]
              ]]);
    }
      if (results.leftHandLandmarks) {
        canvasCtx4.strokeStyle = '#FF0000';
        connect(canvasCtx4, [[
                  results.poseLandmarks[Holist.POSE_LANDMARKS.LEFT_ELBOW],
                  results.leftHandLandmarks[0]
                ]]);
    }
  }
  window.drawConnectors(
      canvasCtx4, results.poseLandmarks, Holist.POSE_CONNECTIONS,
      {color: '#00FF00'});
      window.drawLandmarks(
      canvasCtx4, results.poseLandmarks,
      {color: '#00FF00', fillColor: '#FF0000'});
      window.drawConnectors(
      canvasCtx4, results.rightHandLandmarks, Holist.HAND_CONNECTIONS,
      {color: '#00CC00'});
      window.drawLandmarks(
      canvasCtx4, results.rightHandLandmarks, {
        color: '#00FF00',
        fillColor: '#FF0000',
        lineWidth: 2,
        radius: (data) => {
          return window.lerp(data.from.z, -0.15, .1, 10, 1);
        }
      });
      window.drawConnectors(
      canvasCtx4, results.leftHandLandmarks, Holist.HAND_CONNECTIONS,
      {color: '#CC0000'});
      window.drawLandmarks(
      canvasCtx4, results.leftHandLandmarks, {
        color: '#FF0000',
        fillColor: '#00FF00',
        lineWidth: 2,
        radius: (data) => {
          return window.lerp(data.from.z, -0.15, .1, 10, 1);
        }
      });
      window.drawConnectors(
      canvasCtx4, results.faceLandmarks, Holist.FACEMESH_TESSELATION,
      {color: '#C0C0C070', lineWidth: 1});
      window.drawConnectors(
      canvasCtx4, results.faceLandmarks, Holist.FACEMESH_RIGHT_EYE,
      {color: '#FF3030'});
      window.drawConnectors(
      canvasCtx4, results.faceLandmarks, Holist.FACEMESH_RIGHT_EYEBROW,
      {color: '#FF3030'});
      window.drawConnectors(
      canvasCtx4, results.faceLandmarks, Holist.FACEMESH_LEFT_EYE,
      {color: '#30FF30'});
      window.drawConnectors(
      canvasCtx4, results.faceLandmarks, Holist.FACEMESH_LEFT_EYEBROW,
      {color: '#30FF30'});
      window.drawConnectors(
      canvasCtx4, results.faceLandmarks, Holist.FACEMESH_FACE_OVAL,
      {color: '#E0E0E0'});
      window.drawConnectors(
      canvasCtx4, results.faceLandmarks, Holist.FACEMESH_LIPS,
      {color: '#E0E0E0'});

  canvasCtx4.restore();
}

var camera=null
  useEffect(() => {
    const holistic = new Holistic({
      locateFile: (file) => {
        console.log(file,`/${file}`)
        return `/${file}`;
      },
    });
    holistic.onResults(onResultsHolistic);

    if (typeof videoRef.current !=="undefined" && videoRef.current !==null){
     camera=new cam.Camera(videoRef.current.video, {
    onFrame: async() =>{
    await holistic.send({image: videoRef.current.video})
    },
    width: 450,
    height:400
    })
    camera.start()
    }

    
  });

 

  return (
    <div>

        <div className='relative w-[fit-content] m-auto overflow-x-hidden'>
            <div className='flex'>
            <Webcam
     ref={videoRef} style={{



width:450,
height:400
}}/>
            </div>
     
<div className='absolute left-0 top-0'>
<canvas className='output4'
        ref={holisticRef}
      
      ></canvas>
</div>
        </div>
    
   
    </div>
  );
};

export default HolisticPoseDetection;
