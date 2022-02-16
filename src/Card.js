import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "./index.css";

export default function Card({ data }) {
  //   const types = data.pokemons;
  const zeroPad = (num, places) => String(num).padStart(places, "0");

  return (
    <div className={"card bg-" + data.types[0]}>
      <LazyLoadImage
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`}
        effect="blur"
        alt={data.name}
      />
      <p>#{zeroPad(data.id, 3)}</p>
      <p className="has-text-weight-semibold capital mb-2">{data.name}</p>
      {data.types.map((type) => {
        return (
          <span className={"type-tag has-text-weight-semibold is-size-7-mobile is-size-6-desktop is-" + type} key={data.id + "-" + type}>
            {type}
          </span>
        );
      })}
    </div>
  );
}
