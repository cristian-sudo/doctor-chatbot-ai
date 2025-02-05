'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  role: string;
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({
    "eye doctor": [],
    "general practitioner": [],
    "dentist": [],
  });
  const [role, setRole] = useState("eye doctor");
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const roles = [
    { name: "Eye Doctor", value: "eye doctor", color: "bg-blue-100" },
    { name: "General Practitioner", value: "general practitioner", color: "bg-green-100" },
    { name: "Dentist", value: "dentist", color: "bg-purple-100" },
  ];

  const handleRoleClick = (roleValue: string) => {
    setRole(roleValue);
  };

  const getRoleColor = () => {
    const selectedRole = roles.find((r) => r.value === role);
    return selectedRole ? selectedRole.color : "bg-gray-100";
  };

  useEffect(() => {
    const sendInitialMessage = async () => {
      setIsLoading(true);
      const initialMessage: Message = {
        role: "user",
        content: `acts as a specialist in ${role} and assist a patient`,
      };
      const aiResponse = await fetchAIResponse([initialMessage]);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [role]: [{ role: "assistant", content: aiResponse }],
      }));
      setIsLoading(false);
    };

    if (messages[role].length === 0) {
      sendInitialMessage().then(r => console.log(r));
    }
  }, [role]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const addMessage = async (message: Message) => {
    const updatedMessages = [...messages[role], message];
    setMessages((prevMessages) => ({
      ...prevMessages,
      [role]: updatedMessages,
    }));

    if (message.role === "user") {
      setIsLoading(true);
      const aiResponse = await fetchAIResponse(updatedMessages);
      setIsLoading(false);
      setMessages((prevMessages) => ({
        ...prevMessages,
        [role]: [...prevMessages[role], { role: "assistant", content: aiResponse }],
      }));
    }
  };

  const fetchAIResponse = async (conversationHistory: Message[]) => {
    try {
      const response = await fetch("/api/ai-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: conversationHistory,
        }),
      });
      const data = await response.json();
      return data.content || "Sorry, I am having trouble responding right now.";
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, I am having trouble responding right now.";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      addMessage({ role: "user", content: userInput }).then(r => console.log(r));
      setUserInput("");
    }
  };

  return (
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 text-white flex flex-col items-center py-8 space-y-4">
          <h2 className="text-xl font-bold mb-4">Select Role</h2>
          {roles.map((roleItem) => (
              <button
                  key={roleItem.value}
                  onClick={() => handleRoleClick(roleItem.value)}
                  className={`w-3/4 p-3 rounded-lg text-center font-semibold transition-all ${
                      role === roleItem.value
                          ? `${roleItem.color} text-black shadow-lg`
                          : "bg-gray-700 hover:bg-gray-600"
                  }`}
              >
                {roleItem.name}
              </button>
          ))}
        </div>

        {/* Main Content */}
        <div
            className={`flex-grow flex flex-col items-center justify-center ${getRoleColor()} text-white transition-all`}
        >
          <div className="flex flex-col items-center">
            <img
                src="https://www.chead.ac.uk/wp-content/uploads/2016/01/UoB-Logo-RGB.png"
                alt="doctor"
                className="w-64 h-32 mb-4 drop-shadow-lg"
            />
            <h1 className="text-5xl font-extrabold mb-6 text-black">
              Doctor AI Chat
            </h1>
          </div>
          <div
              className="bg-gray-900 shadow-lg rounded-xl overflow-hidden w-[700px] h-[400px] flex flex-col"
          >
            <div className="p-4 flex-grow overflow-y-auto">
              {messages[role].map((message, index) => (
                  <div
                      key={index}
                      className={`mb-4 flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                  >
                    {message.role === "assistant" && (
                        <div className="flex-shrink-0 mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#fff" stroke="#fff"
                               className="cf-icon-svg" viewBox="-2.5 0 19 19"><path
                              d="M11.56 10.11v2.046a3.827 3.827 0 1 1-7.655 0v-.45A3.61 3.61 0 0 1 .851 8.141V5.25a1.682 1.682 0 0 1 .763-1.408 1.207 1.207 0 1 1 .48 1.04.571.571 0 0 0-.135.368v2.89a2.5 2.5 0 0 0 5 0V5.25a.57.57 0 0 0-.108-.334 1.208 1.208 0 1 1 .533-1.018 1.681 1.681 0 0 1 .683 1.352v2.89a3.61 3.61 0 0 1-3.054 3.565v.45a2.719 2.719 0 0 0 5.438 0V10.11a2.144 2.144 0 1 1 1.108 0zm.48-2.07a1.035 1.035 0 1 0-1.035 1.035 1.037 1.037 0 0 0 1.036-1.035z"/></svg>
                        </div>
                    )}
                    <div className="flex flex-col">
                      <p
                          className={`${
                              message.role === "user" ? "text-right text-blue-300" : "text-left text-gray-300"
                          }`}
                      >
                        {message.role === "user" ? (
                            <strong>You:</strong>
                        ) : (
                            <span className="inline-flex items-center">
                        <strong>Assistant:</strong>
                      </span>
                        )}{" "}
                        {message.content}
                      </p>
                    </div>
                  </div>
              ))}
              {isLoading && (
                  <p className="text-center text-gray-400">
                    <span className="animate-pulse">Typing</span>
                    <span className="animate-bounce">...</span>
                  </p>
              )}
              <div ref={bottomRef}></div>
            </div>
            <form
                className="flex items-center p-2 border-t border-gray-700"
                onSubmit={handleSubmit}
            >
              <input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  className="flex-grow p-3 text-sm bg-gray-900 text-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Type a message..."
              />
              <button
                  type="submit"
                  className="p-3 bg-blue-600 text-white font-bold rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                Send
              </button>
            </form>
          </div>
          <div className="mt-6 text-sm text-black animate-pulse">
            Powered by Doctor AI - Developed by Cristian Plop.
          </div>
        </div>
      </div>
  );
}