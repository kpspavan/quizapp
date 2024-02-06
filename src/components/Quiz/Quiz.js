import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Logo from "../Logo/Logo";
import Loading from "../Loading/Loading";
import "./Quiz.css";

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [hoveredAnswerIndex, setHoveredAnswerIndex] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [loading, setLoading] = useState(true);

  const countdownRef = useRef(null);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        "https://opentdb.com/api.php?amount=10&type=multiple"
      );

      const questionsWithShuffledAnswers = response.data.results.map(
        (question) => {
          const shuffledAnswers = shuffleArray([
            ...question.incorrect_answers,
            question.correct_answer,
          ]);
          return {
            ...question,
            answers: shuffledAnswers,
          };
        }
      );

      setQuestions(questionsWithShuffledAnswers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleAnswerClick = useCallback(
    (selectedAnswer) => {
      clearInterval(countdownRef.current);

      if (selectedAnswer === questions[currentQuestion].correct_answer) {
        setScore((prevScore) => prevScore + 1);
        setCorrectAnswers((prevCorrect) => prevCorrect + 1);
      } else {
        setWrongAnswers((prevWrong) => prevWrong + 1);
      }

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((prevQuestion) => prevQuestion + 1);
        setTimer(10);
      } else {
        setQuizCompleted(true);
      }
    },
    [questions, currentQuestion]
  );

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTimer) => (prevTimer > 0 ? prevTimer - 1 : 0));
    }, 1000);

    countdownRef.current = countdown;

    return () => clearInterval(countdown);
  }, [questions, currentQuestion]);

  useEffect(() => {
    if (timer === 0) {
      handleAnswerClick("");
    }
  }, [timer, handleAnswerClick]);

  const handleHover = (index) => {
    setHoveredAnswerIndex(index);
  };

  const handleLeave = () => {
    setHoveredAnswerIndex(null);
  };

  const handleTakeTestAgain = () => {
    setLoading(true);
    setCurrentQuestion(0);
    setScore(0);
    setTimer(10);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    fetchQuestions();
    setQuizCompleted(false);
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return <span className="badge easy">Easy</span>;
      case "medium":
        return <span className="badge medium">Medium</span>;
      case "hard":
        return <span className="badge hard">Hard</span>;
      default:
        return null;
    }
  };

  return (
    <div className="quiz-container">
      {loading && (
        <p>
          <Loading />
        </p>
      )}
      {!loading &&
        !quizCompleted &&
        questions.length > 0 &&
        currentQuestion < questions.length && (
          <div className="question-section">
            <div>
              <div className="flex">
                <p
                  className={`question-count flex ${
                    timer <= 5 ? "red-text" : ""
                  }`}
                >
                  <Logo />
                  {formatTime(timer)}
                </p>
              </div>
              <span className="question-text">
                Question numbers{" "}
                <span className="tex-bold">{currentQuestion + 1}</span>
              </span>
              /{questions.length}
              {getDifficultyBadge(questions[currentQuestion].difficulty)}
              <p className="question-text">
                {questions[currentQuestion].question}
              </p>
            </div>

            <ul className="answer-options">
              {questions[currentQuestion].answers.map((answer, index) => (
                <li
                  key={index}
                  onClick={() => handleAnswerClick(answer)}
                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={handleLeave}
                  className={`${
                    hoveredAnswerIndex === index ? "selected-answer" : ""
                  }`}
                >
                  {answer}
                </li>
              ))}
            </ul>
          </div>
        )}
      {!loading && quizCompleted && (
        <div className="score-section">
          <p>Total Questions: {questions.length}</p>
          <p>Total Score: {score}</p>
          <p>Correct Answers: {correctAnswers}</p>
          <p>Wrong Answers: {wrongAnswers}</p>
          <button onClick={handleTakeTestAgain}>Take Test Again</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
