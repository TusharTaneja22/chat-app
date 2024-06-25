import React, { useEffect } from "react";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, updateDoc } from "firebase/firestore";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (message.uid !== user.uid && !message.readStatus) {
      const updateReadStatus = async () => {
        const messageRef = doc(db, "messages", message.id);
        await updateDoc(messageRef, { readStatus: true, deliveryStatus: true });
      };
      updateReadStatus();
    }
  }, [message, user]);

  return (
    <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img className="chat-bubble__left" src={message.avatar} alt="user avatar" />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">{message.text}</p>
        <div className="message-status">
          {message.readStatus ? (
            <span style={{ color: "green" }}>✓✓</span>
          ) : message.deliveryStatus ? (
            <span>✓✓</span>
          ) : message.sendStatus ? (
            <span>✓</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Message;

