import { useState } from "react";

function App() {
  const [error, setError] = useState("");
  const [value, setValue] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const surpriseOption = [
    "Who won the latest Nobel Prize on literature?",
    "Where does pizza come from?",
    "Who do you make BLT sandwich?",
  ];

  const suprise = () => {
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
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);
      setChatHistory((oldChatHistory) => [
        ...oldChatHistory,
        {
          role: "user",
          parts: [value], // Fixing incorrect format
        },
        {
          role: "model",
          parts: [data], // Fixing incorrect format
        },
      ]);
      setValue("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong! Please try again later");
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
  };

  return (
    <>
      <div className="app">
        <p>
          What do you want to know?
          <button
            className="surprise"
            onClick={suprise}
            disabled={!chatHistory}
          >
            Surprise me!
          </button>
        </p>

        <div className="input-container">
          <input
            value={value}
            placeholder="When is Eid?"
            onChange={(e) => setValue(e.target.value)}
          />
          {!error && <button onClick={getResponse}>Ask me</button>}
          {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, _index) => (
            <div key={_index}>
              <p className="answer">
                {chatItem.role}: {chatItem.parts.join(" ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
