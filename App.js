import { StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import React, { useState, useCallback, useEffect } from 'react';
import uuid from 'react-native-uuid';

const CHAT_URL = 'https://{QnA-Maker-endpoint}/knowledgebases/{knowledge-base-ID}/generateAnswer'
const ENDPOINT_KEY = 'EndpointKey {QnA Makerのエンドポイントキー}'

// 利用者(右)側のユーザー
const USER = {
  _id: 1,
  name: 'Me',
}
// ボット(左)側のユーザー
const BOT = {
  _id: 2,
  name: 'Bot',
  avatar: 'https://placeimg.com/140/140/any',
}

export default function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    setMessages([
      {
        _id: uuid.v4(),
        text: '質問はありますか？',
        createdAt: new Date(),
        user: BOT,
      },
    ])
  }, [])

  /* QnA MakerのgenerateAnswerAPIをコール */
  const generateAnswer = async (message) => {
    try {
     const response = await fetch(CHAT_URL, {
      method: 'POST',
      headers: {
        Authorization: ENDPOINT_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question: message,
      })
    })
     const json = await response.json();
     const responseMessages = {
       _id: uuid.v4(),
       text: json.answers[0].answer,
       createdAt: new Date(),
       user: BOT,
     }
     /* レスポンスをmessagesに追加 */
     setMessages(previousMessages => GiftedChat.append(previousMessages, responseMessages))
    } catch (error) {
     console.error(error);
   }
 }


  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
    generateAnswer(messages[0].text);
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={USER}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
