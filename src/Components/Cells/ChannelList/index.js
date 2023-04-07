import { doc, getDoc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { ChatContext } from "../../../Context/ChatContext";
import { db } from "../../../firebase";
import eye from "../../../assets/eye.png"
import "./styles.css"
const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  
  const [channelName, setChannelName] = useState([])
  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);

  useEffect(() => {
    const getChannels = () => {
      const unsub = onSnapshot(doc(db, "userChannels", currentUser?.uid), (doc) => {
        setChannels(doc.data())
        doc.exists() && setVisible(true)
      });
      return () => {
        unsub();
      };
    };

    currentUser?.uid && getChannels();
  }, [currentUser?.uid]);


  useEffect(() => {

    getGroupMemberDetails(channelName)
  }, [channelName, data?.membersAddedStatus])

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });

  };

   const getGroupMemberDetails = async (x) => {
    const groupData = await getDoc(doc(db, "userChannels", currentUser?.uid))
    const groupId = groupData.data()[x]["channelInfo"].groupId
    const res = await getDoc(doc(db, "channels", groupId))
     dispatch({ type: "GETGROUPMEMBERS", payload: res.data()["participants"] })

  }


  return (
    <div>{
      !visible
        ? <label className="warnmessage">Loading ...</label>
        : <div className="channels">
          {Object.entries(channels)?.sort((a, b) => b[1].channelInfo.date - a[1].channelInfo.date).map((channels) => (
            <div
              className="userChat"
              key={channels[0]}
              onClick={() => {
                setSelected(channels[1].channelInfo.channelNameId)
                handleSelect(channels[1].channelInfo);
                setChannelName(channels[1].channelInfo.channelName)
                
              }} >
              
              <ol className="userChannalInfo">
                <span className="channelInfo"># {channels[1].channelInfo.channelName}</span>
              </ol>
                {channels[1].channelInfo.channelNameId==selected&&<img className="eyeImg"  src={eye} alt=""></img>}
            </div>
          ))}
        </div>}
    </div>
  );
};

export default Channels;
