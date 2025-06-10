// App principale per "Domanda del Giorno"
import { useState, useEffect, useMemo } from "react";
import { questions } from "./data/questions";
import { chores } from "./data/chores";

function App() {
  const startDate = useMemo (() => new Date("2025-06-13T00:00:00"),[]);
  const today = new Date();
  const todayKey = today.toISOString().split("T")[0];
  const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const questionIndex = daysSinceStart >= 0 ? daysSinceStart % questions.length : -1;

  const [answered, setAnswered] = useState(
    localStorage.getItem("answered_" + todayKey) === "true"
  );
  const [selectedOption, setSelectedOption] = useState(null);
  const [countdown, setCountdown] = useState("");

  const question = questions[questionIndex];
  const reward = chores[questionIndex % chores.length];

  const handleAnswer = () => {
    if (selectedOption !== null && !answered) {
      setAnswered(true);
      localStorage.setItem("answered_" + todayKey, "true");
    }
  };

  useEffect(() => {
    if (daysSinceStart < 0) {
      const interval = setInterval(() => {
        const now = new Date();
        const distance = startDate - now;

        if (distance <= 0) {
          clearInterval(interval);
          setCountdown("");
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((distance / (1000 * 60)) % 60);
          const seconds = Math.floor((distance / 1000) % 60);

          setCountdown(`${days}g ${hours}h ${minutes}m ${seconds}s`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [daysSinceStart, startDate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-orange-100 flex flex-col items-center justify-start p-4 sm:p-6 md:p-8">
      <div className="text-center mb-6 mt-10 w-full max-w-lg">
        <h1 className="text-4xl sm:text-5xl font-bold text-rose-600 font-serif drop-shadow-md">
          🌸 Ciao Amore 🌸
        </h1>
        <p className="text-md sm:text-lg mt-2 text-rose-700 italic">
          Una domanda al giorno per rendere la tua giornata speciale
        </p>
      </div>

      {questionIndex >= 0 && question ? (
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-md border border-rose-200">
          <p className="text-lg sm:text-xl font-semibold mb-6 text-rose-800">
            {question.question}
          </p>

          <ul className="space-y-3">
            {question.options.map((opt, idx) => (
              <li key={idx}>
                <button
                  onClick={() => setSelectedOption(opt)}
                  disabled={answered}
                  className={`w-full px-4 py-3 sm:px-5 rounded-full border text-rose-700 font-medium shadow ${
                    selectedOption === opt ? "bg-rose-100 border-rose-400" : "bg-white border-rose-200"
                  } hover:bg-rose-50 transition-all duration-200 ${
                    answered ? "cursor-not-allowed opacity-60" : "hover:scale-105"
                  }`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>

          {!answered && (
            <button
              onClick={handleAnswer}
              className="mt-8 w-full bg-rose-500 text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-rose-600 transition-all"
            >
              ✨ Rispondi ✨
            </button>
          )}

          {answered && (
            <div className="mt-8 text-center text-rose-700">
              {selectedOption === question.answer ? (
                <>
                  <p className="text-green-600 font-bold text-xl">Brava fochina! 🎉</p>
                  <p className="mt-3 text-lg">Premio di oggi: <strong>{reward}</strong></p>
                </>
              ) : (
                <>
                  <p className="text-red-500 font-bold text-xl">Hehehe, stupida fochina, la risposta era: <strong>{question.answer}</strong></p>
                  <p className="mt-3 text-lg">Ti sei persa: <strong>{reward}</strong></p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-xl p-6 max-w-md w-full text-center">
          <p className="text-rose-700 text-lg font-semibold mb-2">
            Le domande iniziano giovedì prossimo! ⏳
          </p>
           {countdown && (
            <p className="text-rose-500 text-2xl font-bold">{countdown}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;