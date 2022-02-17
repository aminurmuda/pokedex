import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PokemonList from "./PokemonList";
import PokemonDetail from "./PokemonDetail";
import Floating from "./Floating";

export default function App() {
  let [online, isOnline] = useState(navigator.onLine);

  const setOnline = () => {
    console.log("We are online!");
    isOnline(true);
  };
  const setOffline = () => {
    console.log("We are offline!");
    isOnline(false);
  };

  // Register the event listeners
  useEffect(() => {
    window.addEventListener("offline", setOffline);
    window.addEventListener("online", setOnline);

    // cleanup if we unmount
    return () => {
      window.removeEventListener("offline", setOffline);
      window.removeEventListener("online", setOnline);
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route exact path="/" element={<PokemonList />}></Route>
          <Route exact path="/detail/:id" element={<PokemonDetail />}></Route>
        </Routes>
      </Router>
      <Floating isActive={!online} content={"Offline mode"} />
    </>
  );
}
