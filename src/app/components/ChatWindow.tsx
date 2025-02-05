'use client';

import React, { useState, useEffect, useRef } from 'react';

interface ChatWindowProps {
    messages: { sender: string; text: string }[];
    isLoading: boolean;
}

function ChatWindow({ messages, isLoading }: ChatWindowProps) {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="p-4 h-96 overflow-y-auto">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex items-center mb-2 p-2 rounded-lg shadow-sm transition-transform transform ${
                        msg.sender === 'ai' ? 'bg-blue-100 text-blue-900' : 'bg-gray-200 text-gray-900'
                    }`}
                >
                    <div className="mr-2">
                        {msg.sender === 'ai' ? (
                            <svg
                                className="w-6 h-6 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4v8" />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a7.5 7.5 0 017.5 7.5 7.5 7.5 0 01-15 0A7.5 7.5 0 0112 4.5z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7.5v6m0 0l-2-2m2 2l2-2" />
                            </svg>
                        )}
                    </div>
                    <div className="text-black">{msg.text}</div>
                </div>
            ))}
            {isLoading && (
                <div className="flex items-center mb-2 p-2 rounded-lg shadow-sm bg-blue-100 text-blue-900">
                    <div className="mr-2">
                        <svg
                            className="w-6 h-6 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h8m-4-4v8" />
                        </svg>
                    </div>
                    <div className="animate-pulse">Typing...</div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default function Home() {
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [role, setRole] = useState('eye doctor');
    const [isLoading, setIsLoading] = useState(false);
    const [userInput, setUserInput] = useState('');

    const addMessage = async (message: { sender: string; text: string }) => {
        setMessages([...messages, message]);

        if (message.sender === 'user') {
            setIsLoading(true);
            const aiResponse = await fetchAIResponse(message.text);
            setIsLoading(false);
            setMessages((prevMessages) => [
                ...prevMessages,
                { sender: 'ai', text: aiResponse },
            ]);
        }
    };

    const fetchAIResponse = async (userInput: string) => {
        try {
            const response = await fetch('/api/ai-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: `You are a highly experienced and certified ${role} with extensive knowledge in the latest medical advancements and patient care practices. Respond to the following inquiry: ${userInput}`,
                }),
            });
            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error('Error fetching AI response:', error);
            return 'Sorry, I am having trouble responding right now.';
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInput(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userInput.trim()) {
            addMessage({ sender: 'user', text: userInput });
            setUserInput('');
        }
    };

    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setRole(e.target.value);
        setMessages([]);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4 text-blue-600">Doctor AI Chat</h1>
            <select
                value={role}
                onChange={handleRoleChange}
                className="mb-4 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="eye doctor">Eye Doctor</option>
                <option value="general practitioner">General Practitioner</option>
                <option value="dentist">Dentist</option>
            </select>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-md">
                <ChatWindow messages={messages} isLoading={isLoading} />
                <form onSubmit={handleSubmit} className="flex p-2 border-t border-gray-300">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleInputChange}
                        className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="p-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}