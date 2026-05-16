import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BookPage } from "./pages/BookPage";
import { SplashPage } from "./pages/SplashPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/book/:id" element={<BookPage />} />
      </Routes>
    </BrowserRouter>
  );
}
