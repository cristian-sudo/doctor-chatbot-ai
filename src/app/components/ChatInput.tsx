'use client';

import React, { useState } from 'react';

interface ChatInputProps {
    addMessage: (message: { sender: string; text: string }) => void;
}

function ChatInput({ addMessage }: ChatInputProps) {
    const [input, setInput] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        addMessage({ sender: 'user', text: input });
        setInput('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center p-4 border-t border-gray-300">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-300"
            />
            <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition ease-in-out duration-300"
            >
                Send
            </button>
        </form>
    );
}

export default ChatInput;