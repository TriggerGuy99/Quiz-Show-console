import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import QRCode from "qrcode.react";

function PresentationView() {
  const { eventId } = useParams();
  const [eventData, setEventData] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    const eventRef = doc(db, "events", eventId);
    const unsubscribe = onSnapshot(eventRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setEventData(data);
        setCurrentSlideIndex(data.currentSlideIndex || 0);
      } else {
        setEventData(null);
      }
    });

    return () => unsubscribe();
  }, [eventId]);

  const handleNextSlide = async () => {
    if (!eventData) return;
    const eventRef = doc(db, "events", eventId);
    const nextIndex = currentSlideIndex + 1;
    if (nextIndex < eventData.slides.length) {
      await updateDoc(eventRef, { currentSlideIndex: nextIndex });
    }
  };

  if (!eventData) {
    return <p>Event not found or has ended.</p>;
  }

  const currentSlide = eventData.slides[currentSlideIndex];

  return (
    <div style={{ padding: "1rem" }}>
      <h2>{eventData.title}</h2>
      <div style={{ marginBottom: "1rem" }}>
        <QRCode value={window.location.href} size={128} />
        <p>Scan to join the event</p>
      </div>
      {currentSlide ? (
        <div>
          <h3>{currentSlide.title}</h3>
          {currentSlide.type === "info" && <p>{currentSlide.content}</p>}
          {currentSlide.type === "mcq" && (
            <div>
              <p>{currentSlide.question}</p>
              <ul>
                {currentSlide.options.map((opt, idx) => (
                  <li key={idx}>{opt}</li>
                ))}
              </ul>
              <p>Time limit: {currentSlide.timeLimit} seconds</p>
            </div>
          )}
          <button onClick={handleNextSlide}>Next Slide</button>
        </div>
      ) : (
        <p>No slides available.</p>
      )}
    </div>
  );
}

export default PresentationView;
