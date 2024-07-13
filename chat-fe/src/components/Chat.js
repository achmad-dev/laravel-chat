import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';

const Chat = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);


    const pusher_app_key = process.env.REACT_APP_PUSHER_APP_KEY || "your_pusher_app_key";
    const pusher_cluster = process.env.REACT_APP_PUSHER_APP_CLUSTER || "your_pusher_cluster";
    console.log(pusher_app_key)
    useEffect(() => {
        const pusher = new Pusher(pusher_app_key, {
            cluster: pusher_cluster,
        });

        const channel = pusher.subscribe('chat');
        channel.bind('chat', (data) => {
            console.log(data, message)
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        // fetchMessages();

        return () => {
            pusher.unsubscribe('chat');
        };
    }, []);

    const fetchMessages = async () => {
        const response = await axios.get('http://localhost:8000/api/latestmessages');
        setMessages(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name && message) {
            await axios.post('http://localhost:8000/api/messages', { name, message });
            setMessage('');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    required
                />
                <button type="submit">Send</button>
            </form>
            <div>
                {messages.map((msg) => (
                    <div key={msg.id}>
                        <strong>{msg.name}:</strong> {msg.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Chat;