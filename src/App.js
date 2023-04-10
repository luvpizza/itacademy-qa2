import "./App.scss"
import { BrowserRouter, redirect, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header/Header";
import RepositoriesPage from "./pages/RepositoriesPage/RepositoriesPage";
import RepositoryCardPage from "./pages/RepositoryCardPage/RepositoryCardPage";
function App() {
  
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="" element={<RepositoriesPage/>}/>
        <Route path="/card/:id" element={<RepositoryCardPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
