import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  doc,
  onSnapshot,
  updateDoc,
  arrayUnion,
  getDoc,
} from "firebase/firestore";

function ParticipantView() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  useEffect(() => {
    const eventRef = doc(db, "events", eventId);
    const unsubscribe = onSnapshot(eventRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEventData(data);
        setCurrentQuestion(data.currentQuestion || null);
        setAnswerSubmitted(false);
        setSelectedAnswer(null);
        setCanSubmit(false);
        setTimeLeft(data.timeLeft || 0);
      } else {
        setEventData(null);
      }
    });

    return () => unsubscribe();
  }, [eventId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft - 1 <= 0) {
          setCanSubmit(false);
        }
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (currentQuestion) {
      // Disable submit for first 2 seconds
      setCanSubmit(false);
      const enableSubmitTimeout = setTimeout(() => {
        setCanSubmit(true);
      }, 2000);
      return () => clearTimeout(enableSubmitTimeout);
    }
  }, [currentQuestion]);

  const handleSubmitAnswer = async () => {
    if (!canSubmit || answerSubmitted || selectedAnswer === null) return;
    try {
      const eventRef = doc(db, "events", eventId);
      await updateDoc(eventRef, {
        answers: arrayUnion({
          participantId: "anonymous", // TODO: Add participant identification if needed
          questionId: currentQuestion.id,
          answer: selectedAnswer,
          timestamp: new Date(),
        }),
      });
      setAnswerSubmitted(true);
      setCanSubmit(false);
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  if (!eventData) {
    return <p>Event not found or has ended.</p>;
  }

  if (!currentQuestion) {
    return <p>Waiting for the next question...</p>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h3>{currentQuestion.text}</h3>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {currentQuestion.options.map((option, index) => (
          <li key={index} style={{ marginBottom: "0.5rem" }}>
            <label>
              <input
                type="radio"
                name="answer"
                value={index}
                disabled={!canSubmit || answerSubmitted}
                checked={selectedAnswer === index}
                onChange={() => setSelectedAnswer(index)}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSubmitAnswer}
        disabled={!canSubmit || answerSubmitted || selectedAnswer === null}
      >
        Submit Answer
      </button>
      <p>Time left: {timeLeft} seconds</p>
      {answerSubmitted && <p>Answer submitted. Thank you!</p>}
    </div>
  );
}

export default ParticipantView;
