import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { surpriseOption } from "../data/question";
import Typewriter from "./components/Typewriter";
import Header from "./components/header";

function App() {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false); // State to manage typing indicator

  const surprise = () => {
    const randomValue =
      surpriseOption[Math.floor(Math.random() * surpriseOption.length)];
    setValue(randomValue);
  };

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [value],
        },
      ]);
      setValue("");
      setIsTyping(true); // Show typing indicator

      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);

      // Simulate typing delay
      setTimeout(() => {
        setChatHistory((oldChatHistory) => [
          ...oldChatHistory,
          {
            role: "model",
            parts: [data],
          },
        ]);
        setIsTyping(false); // Hide typing indicator
      }, 2000); // Adjust delay (in milliseconds) as needed
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later");
      setIsTyping(false); // Hide typing indicator in case of error
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
    setIsTyping(false); // Reset typing indicator
  };

  return (
    <>
      <Header />
      <div className="app">
        {chatHistory.length > 0 ? (
          <div className="chat-container">
            {chatHistory.map((chatItem, _index) => (
              <div
                key={_index}
                className={`answer ${
                  chatItem.role === "user" ? "user" : "model"
                }`}
              >
                <div>
                  {chatItem.role === "model" ? (
                    <Typewriter text={chatItem.parts.join(" ")} />
                  ) : (
                    <ReactMarkdown>{chatItem.parts.join(" ")}</ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="answer model">
                <div>
                  <em>Reasoning...</em>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="intro">
            <h3>What can I help with?</h3>
          </div>
        )}
      </div>
      <div className="question">
        <p className="para">
          What do you want to know?
          <button
            className="surprise"
            onClick={surprise}
            disabled={!chatHistory}
          >
            Surprise me!
          </button>
        </p>

        <div className="input-container">
          <input
            value={value}
            placeholder="Ask anything"
            onChange={(e) => setValue(e.target.value)}
            required
          />
          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
      </div>
    </>
  );
}

export default App;
