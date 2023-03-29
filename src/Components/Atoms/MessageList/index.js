import { doc, getDoc } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import "./styles.css"
import pdfIcon from "../../../assets/download11.png"
const Message = ({ message }) => {
  // const [messagetime,setMessageTime]=useState()
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [gotdata, setGotData] = useState()
  const date = new Date()
  const time = `${date.getHours()}:${date.getMinutes()}`
  const ref = useRef();

  useEffect(() => {
    const get = async () => {
      const res = await getDoc(doc(db, "users", message.senderId))
      setGotData(res.data())
    }
    get()
  }, []);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message${message.senderId === currentUser.uid && "owner"}`} >
      <div className="messageInfo">
        {gotdata && <label>    {gotdata.displayName}</label>}
        {gotdata && <img className="senderimg"
          src={
            gotdata?.photoURL
          }
          alt=""
        />}
        {message?.date == time ? <span>Just Now</span> : <span>{message.date}</span>}
      </div>
      <div className="messageContent">
        {message?.text && <p className="messgtext">{message.text}</p>}
        {message?.img && <img className="chatimg" src={message.img} alt="" />}
        {message?.file && <a href={message.file} download  ><img className="pdf" src={pdfIcon}></img></a>}
        {message?.fileName && <label className="fileName">{message.fileName}</label>}

      </div>
    </div>
  );
};

export default Message;
