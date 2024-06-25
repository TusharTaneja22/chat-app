import React, { useEffect, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribeActiveUsers = onSnapshot(
      collection(db, "activeUsers"),
      (QuerySnapshot) => {
        const fetchedUsers = [];
        QuerySnapshot.forEach((doc) => {
          fetchedUsers.push({ ...doc.data(), id: doc.id });
        });
        setActiveUsers(fetchedUsers);
      }
    );

    return () => unsubscribeActiveUsers();
  }, []);

  useEffect(() => {
    const updateUserStatus = async () => {
      const user = auth.currentUser;
      const userRef = doc(db, "activeUsers", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await updateDoc(userRef, { lastActive: serverTimestamp() });
      } else {
        await setDoc(userRef, { lastActive: serverTimestamp() });
      }
    };

    const intervalId = setInterval(updateUserStatus, 30000); // Update every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="chat-box">
      <div className="active-users">
        <h2 style={{marginLeft:'16px', marginTop:'16px'}}>Active Users</h2>
        {activeUsers.map((user) => (
          <div key={user.id} className="active-user">
            <img src={user.avatar} alt={user.name} />
            <p>{user.name}</p>
          </div>
        ))}
      </div>
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} />
    </main>
  );
};

export default ChatBox;
