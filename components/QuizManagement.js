import React, { useState, useEffect } from "react";
import { db } from "../src/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

function QuizManagement() {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "quizzes"), (snapshot) => {
      const quizList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddQuiz = async () => {
    if (!newQuizTitle.trim()) return;
    try {
      await addDoc(collection(db, "quizzes"), {
        title: newQuizTitle.trim(),
        createdAt: new Date(),
      });
      setNewQuizTitle("");
    } catch (error) {
      console.error("Error adding quiz: ", error);
    }
  };

  const handleDeleteQuiz = async (id) => {
    try {
      await deleteDoc(doc(db, "quizzes", id));
    } catch (error) {
      console.error("Error deleting quiz: ", error);
    }
  };

  return (
    <div>
      <h4>Quiz/Event Management</h4>
      <div>
        <input
          type="text"
          placeholder="New Quiz Title"
          value={newQuizTitle}
          onChange={(e) => setNewQuizTitle(e.target.value)}
          style={{ marginRight: "0.5rem" }}
        />
        <button onClick={handleAddQuiz}>Add Quiz</button>
      </div>
      {loading ? (
        <p>Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes found.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id} style={{ marginTop: "0.5rem" }}>
              {quiz.title}{" "}
              <button onClick={() => handleDeleteQuiz(quiz.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default QuizManagement;
