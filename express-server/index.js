const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const {addUser,getuserinroom,removeUser,getUser,isEmpty} =require('./user');



require('dotenv').config();

const cors=require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


const port=process.env.PORT||8000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        // origin: "http://localhost:3000",
        'Access-Control-Allow-Origin':'*',
        origin:"*",
        methods: ["GET", "POST"]
      }
 });
app.get('/',(req,res)=>{
  res.send("heltp")
})

io.on("connection", (socket) => {
  socket.on("join",({name,room},callback)=>{
   console.log(name,room)
    const {error,user}=addUser({id:socket.id,name,room});
    if(error)
    return callback(error)

    socket.join(user.room);//useris in room
    io.to(user.room).emit('roomData',{
      users:getuserinroom(user.room)
    })
 
    
    callback();
  });
 

  // messages
  socket.on('sendMessage',({message},callback)=>{
    const user=getUser(socket.id);

    io.to(user.room).emit('message',{
      user:user.name,text:message});
      callback();
    });
   
  
 
  socket.on("disconnect",()=>{
    const user=removeUser(socket.id);
    if(user){
    
    
    
      io.to(user.room).emit('roomData',{
        
        users:getuserinroom(user.room)
      })
  }
  })
});

httpServer.listen(port,()=>{
    console.log("server is running")
});
// module.exports=httpServer;