import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PokemonList from "./PokemonList";
import PokemonDetail from "./PokemonDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<PokemonList />}></Route>
        <Route exact path="/detail/:id" element={<PokemonDetail />}></Route>
      </Routes>
    </Router>
  );
}
