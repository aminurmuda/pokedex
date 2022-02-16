import React, { useState, useRef, useCallback } from "react";
import Card from "./Card";
import usePokemonList from "./usePokemonList";
import { Link } from "react-router-dom";

export default function PokemonList() {
  const [pageNumber, setPageNumber] = useState(1);

  const { pokemons, hasMore, loading, error } = usePokemonList(pageNumber);

  const observer = useRef();
  const lastPokemonElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log("visible", node);
    },
    [loading, hasMore]
  );

  return (
    <div className="container mt-6 px-4">
      <div className="columns is-mobile is-multiline">
        {pokemons.map((pokemon, index) => {
          return (
            <div className="column is-half-mobile is-half-desktop">
              {pokemons.length === index + 1 ? (
                <Link
                  ref={lastPokemonElementRef}
                  to={"/detail/" + pokemon.name}
                  key={pokemon.id}
                >
                  <Card data={pokemon} />
                </Link>
              ) : (
                <Link to={"/detail/" + pokemon.name} key={pokemon.id}>
                  <Card data={pokemon} />
                </Link>
              )}
            </div>
          );
        })}
        <div>{loading && "Loading..."}</div>
        <div>{error && "Error"}</div>
      </div>
    </div>
  );
}
