let socket = io();

socket.on('number',(msg)=> {
    console.log('message: '+msg);
    //$('#number').text(msg);
})