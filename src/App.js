import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import SudokuGame from "./Components/SudokuGame";
import Header from "./CommonComponents/Header";
import Footer from "./CommonComponents/Footer";
import "animate.css";
import "./App.css";

function App() {
  return (
    <Router>
      <Header />
      <div className="App">
        <Routes>
          {/* <Route path="/sudoku" element={<SudokuGame />} /> */}
          <Route path="/" element={<SudokuGame />} />
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

// function Home() {
//   const navigate = useNavigate();

//   const handleButtonClick = () => {
//     navigate("/sudoku");
//   };

//   return (
//     <>
//    <h1 class="animate__heartBeat">Fun Time With Sudoku..!!</h1>
//     <div className="Home">
//       <h3 class="animate__heartBeat">Welcome To The Game</h3>
//       <button onClick={handleButtonClick}>Let's Play</button>
//     </div>
//     </>
//   );
// }

export default App;
