import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import "./styles.css"
import { images } from "../../../Images";
import Display from "../Display";
import Modal from "../Modal";
const Message = ({ message }) => {
  const { data } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext);
  const [gotdata, setGotData] = useState()
  const [groupMembers, setGroupMembers] = useState([])
  const [show, setShow] = useState(false)
  const date = new Date()
  
  const ref = useRef();
  useEffect(() => {
    get()

  }, []);
  useEffect(() => {
    const unSub = data?.groupId && onSnapshot(doc(db, "channels", data?.groupId), (doc) => {
      setGroupMembers(doc?.data()["participants"])
    });
    return () => {
      data?.groupId && unSub();
    };
  }, [data]);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
     }, [message]);

  const get = async () => {
    const res = await getDoc(doc(db, "users", message.senderId))
    setGotData(res.data())
  }

  return (
    <div
      ref={ref}
      className={`message${message.senderId === currentUser?.uid && "owner"}`} >
      <div className="messageInfo">
        <div>
          {data?.groupId && message.senderId === currentUser.uid && <img className="messageSeenDetails" src={images.messageSeenDetails} alt="" onClick={() => { setShow(true) }}></img>}
          {gotdata && <img className="senderimg"
            src={
              gotdata?.photoURL
            }
            alt=""
          />}
        </div>
        <div className="messageContent">
          <div className="userDetails">
            {gotdata && <label className="senderName">    {gotdata.displayName}</label>}
            <span className="atTime">{message.date}</span>
            {!data?.groupId && message.senderId == currentUser.uid ? !message?.status ? <img className="seenStatus" src={images.singleTick} ></img> : <img className="seenStatus" src={images.doubleTick} ></img> : null}

            {data?.groupId && message.senderId == currentUser.uid ? message?.membersSeenGroupText?.length !== groupMembers?.length - 1 ? <img className="seenStatus" src={images.singleTick} ></img> : <img className="seenStatus" src={images.doubleTick} ></img> : null}
          </div>
          {message?.text && <p className={`messgtext${message.senderId === currentUser?.uid && "owner"}`}>{message.text}</p>}
          {message?.img && <a href={message.img} target="_blank" download   ><img className="chatimg" src={message.img} alt="" /></a>}
          {message?.file && <a href={message.file} target="_blank" download  ><img className="pdf" src={images.file} alt=""></img></a>}
          {message?.fileName && <label className="fileName">{message.fileName}</label>}
          <Modal show={show} setShow={setShow} showHead={"true"} title={"Seen By"}>
            <div className="closeSeenDetailsButton">
              <img className="crossBlack" src={images.crossBlack} alt="" onClick={() => { setShow(false) }}></img>
            </div>
            <div className="seenByMembers">
                  {message?.membersSeenGroupText?.length
             ?message?.membersSeenGroupText?.map((val,i,arr) =>{
                       return(groupMembers?.map(value =>
                  (value.uid === val &&
                    <h7 >
                  <div>
                    {value?.name}
                  </div>
                  <div className="seenByMembersDetails">
                    {value?.email}
                  </div>
                </h7>)))}):<h1>no user</h1>}
                  
            </div>

          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Message;
