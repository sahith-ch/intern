import React, { useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import { Socket } from 'socket.io-client';

interface VideoCallProps {
  socket: Socket;
  setIsVideoCallActive: (active: boolean) => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ socket, setIsVideoCallActive }) => {
  const [me, setMe] = useState<string>('vCP54IEeN8emCmedAAAF');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [receivingCall, setReceivingCall] = useState<boolean>(false);
  const [caller, setCaller] = useState<string>('');
  const [callerSignal, setCallerSignal] = useState<Peer.SignalData | null>(null);
  const [callAccepted, setCallAccepted] = useState<boolean>(false);
  const [idToCall, setIdToCall] = useState<string>('XyXoAf9hWqQuFeHHAAAD'); 
  const [callEnded, setCallEnded] = useState<boolean>(false);
  const [name, setName] = useState<string>('Someone');
  
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const connectionRef = useRef<Peer.Instance | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream);
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
    });

    socket.on('me', (id: string) => {
      setMe("vCP54IEeN8emCmedAAAF");
    });

    socket.on('callUser', (data: { from: string; name: string; signal: Peer.SignalData }) => {
      console.log("Receiving call from:", data.from);
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  
    // Clean up event listeners
    return () => {
      socket.off('me');
      socket.off('callUser');
    };

  
  }, [socket]);
 
  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream || undefined,
    });

    console.log("Call user inititated");
    
    peer.on('signal', (data: Peer.SignalData) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: "vCP54IEeN8emCmedAAAF",
        name: name,
      });
    });

    peer.on('stream', (userStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = userStream;
      }
    });

    socket.on('callAccepted', (signal: Peer.SignalData) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream || undefined,
    });

    peer.on('signal', (data: Peer.SignalData) => {
      socket.emit('answerCall', { signal: data, to: caller });
    });

    peer.on('stream', (userStream: MediaStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = userStream;
      }
    });

    if (callerSignal) {
      peer.signal(callerSignal);
    }
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
    setIsVideoCallActive(false); // Hide the video call interface
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', color: '#fff' }}>Zoomish</h1>
      <div className="container">
        <div className="video-container">
          <div className="video">
            {stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />}
          </div>
          <div className="video">
            {callAccepted && !callEnded ? (
              <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
            ) : null}
          </div>
        </div>
        <div className="myId">
          <div className="call-button">
            {callAccepted && !callEnded ? (
              <button onClick={leaveCall} style={{ padding: '10px', margin: '10px', backgroundColor: 'red', color: 'white' }}>
                End Call
              </button>
            ) : (
              <button onClick={() => callUser("XyXoAf9hWqQuFeHHAAAD")} style={{ padding: '10px', margin: '10px', backgroundColor: 'green', color: 'white' }}>
                Call
              </button>
            )}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <button onClick={answerCall} style={{ padding: '10px', margin: '10px', backgroundColor: 'blue', color: 'white' }}>
                Answer
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
