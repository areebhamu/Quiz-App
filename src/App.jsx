import Quiz from "./components/quiz/Quiz";
import { jsQuiz } from "./Questions";
import Nav from "./components/Navbar/Nav";
function App() {
  return (
    <>
      <Nav/>
      <Quiz questions={jsQuiz.questions} />
    </>
  );
}

export default App;
