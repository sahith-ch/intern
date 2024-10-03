"use client";
import { getAllAppointment } from "@/actions/appointment/getOppintments";
import { useUser } from "@/app/context/userContext";
import { useMail } from "@/components/chat/chat";
import { ChatDisplay } from "@/components/chat/chatDisplay";
import ContactList from "@/components/chat/ContactList";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import React, { useEffect, useState, useCallback } from "react";
import { useCookies } from "react-cookie";
import { io } from "socket.io-client";

interface MailItem {
  id: string;
  creator: {
    name: string;
  };
  read: boolean;
  updated_at: string;
  labels: string[];
}
interface Message {
  id: number;
  content: string;
  senderId: string;
  sender:{
    name:string;
  }
  senderName:string
  createdAt: string;
  filePath?: string;
  fileType?: string;
  fileName?: string;
}



const defaultLayout = [265, 360, 655]
const socket = io("http://localhost:8000");

const Page = () => {
  const [mail,setMail] = useMail();
  const { id ,role} = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [message, setMessage] = useState([]);
  const [sheetState, setSheetState] = useState(false);
  const [list, setList] = useState<any[]>([]);

  const [cookie, setCookie] = useCookies([
    "react-resizable-panels:collapsed",
    "react-resizable-panels:layout",
  ]);
  

  // const GetMessages = useCallback(async () => {
  //   if (!mail.selected) {
  //     return;
  //   }
  //   let data = await fetch(
  //     `https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${mail.selected}`
  //   );
  //   data = await data.json();
  //   console.log("messages = ",data)
  // }, [mail.selected]);

  const [doctorId,setdoctorId] = useState<string|null>("");
  const [clientId,setclientId] = useState<string|null>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [convoId,setConvoId] = useState<any>("")
const [messageCount,setmessageCount]=useState(0)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    let doctorId = role === "DOCTOR" ? id : mail.selected;
    let clientId = role === "DOCTOR" ? mail.selected : id;
    setdoctorId(doctorId)
    setclientId(clientId)

  
    const roomId = `room_${doctorId}_${clientId}`;
    console.log(mail.type)
    if(mail.type==="COMMUNITY"){
      let userId  = id;
     
      const conversationId = mail.selected
      console.log("convoid ",conversationId)
    socket.emit("joinCommunity", { conversationId, userId });
      
    }else{
    socket.emit("joinRoom", { doctorId, clientId });
    

    }
    socket.on("conversationId", (Dataid) => {
      console.log("Received conversationId:", Dataid);
      setConvoId(Dataid); // Store the received convoId
   
    });
    socket.on("previousMessages", (previousMessages:any) => {
      console.log("prev",previousMessages)
      setMessages(previousMessages.message);
      setmessageCount(previousMessages.unreadCount)
    });
    socket.on("receivedMessage", (newMessage: Message) => {
      setMessages((prevMessages) => {
        // Check if the message already exists to prevent duplicates
        if (!prevMessages.some(msg => msg.id === newMessage.id)) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
    });


 

    return () => {
     socket.off("previousMessages");
      socket.off("receiveMessage");
      socket.off("conversationId");

    };
  }, [doctorId, clientId,mail.selected]);
  const getAllAppointments = async () => {
    const data = await getAllAppointment(id,role);
    console.log("da",data)
    if (data.data && data.data?.length) {
      setList(data.data);
      console.log("d",data)
    }
  };

  useEffect(() => {
    getAllAppointments();
  }, []);

  const updateSheetState = (val: boolean) => {
    setSheetState(val);
  };

  return (
    <div className="w-full h-full p-4">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          setCookie("react-resizable-panels:layout", JSON.stringify(sizes));
        }}
        className="h-full max-h-[800px] border rounded-lg items-stretch"
      >
        {isMobile && mail.selected ? null : (
          <ResizablePanel defaultSize={23} minSize={25} maxSize={35}>
            <ContactList socket={socket} messageCount={messageCount} sheetState={sheetState} items={list} />
          </ResizablePanel>
        )}
        {!isMobile && <ResizableHandle withHandle />}
        {isMobile ? (
          mail.selected ? (
            <ResizablePanel defaultSize={defaultLayout[2]}>
              <ChatDisplay socket={socket} doctorId={doctorId} clientId={clientId} convoId = {convoId} messages={messages} removedata={() => setMessage([])} />
              </ResizablePanel>
          ) : null
        ) : (
          <ResizablePanel defaultSize={defaultLayout[2]}>
              <ChatDisplay socket={socket} doctorId={doctorId} clientId={clientId} convoId = {convoId} messages={messages} removedata={() => setMessage([])} />
              </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;




const mails =[ 
  {
    id: '1',
    creator: {
      name: 'John Doe',
    },
    read: false,
    updated_at: '2024-08-14T10:30:00Z',
    labels: ['Important', 'Work'],
  },
  {
    id: '2',
    creator: {
      name: 'Jane Smith',
    },
    read: true,
    updated_at: '2024-08-13T15:45:00Z',
    labels: ['Personal', 'Urgent'],
  },
  {
    id: '3',
    creator: {
      name: 'Alice Johnson',
    },
    read: false,
    updated_at: '2024-08-12T08:20:00Z',
    labels: ['Newsletter'],
  },
  {
    id: '4',
    creator: {
      name: 'Bob Brown',
    },
    read: true,
    updated_at: '2024-08-11T11:00:00Z',
    labels: ['Work'],
  },
  {
    id: '5',
    creator: {
      name: 'Carol White',
    },
    read: false,
    updated_at: '2024-08-10T17:25:00Z',
    labels: ['Important', 'Family'],
  },]