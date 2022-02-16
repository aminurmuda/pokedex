import { useEffect, useState } from "react";
// import POKEMON_LIST from "./query/pokmon-list.gql"
import axios from "axios";
import React from "react";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
} from "@apollo/client";

export default function usePokemonList(pageNumber = 1) {
  const client = new ApolloClient({
    uri: "https://beta.pokeapi.co/graphql/v1beta",
    cache: new InMemoryCache(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    client
      .query({
        query: gql`
          query getPokemons {
            species: pokemon_v2_pokemonspecies(
              limit: 20
              offset: ${(pageNumber - 1) * 20}
              order_by: { id: asc }
            ) {
              id
              name
              pokemons: pokemon_v2_pokemons {
                id
                types: pokemon_v2_pokemontypes {
                  type: pokemon_v2_type {
                    name
                  }
                }
              }
            }
            species_aggregate: pokemon_v2_pokemonspecies_aggregate {
              aggregate {
                count
              }
            }
          }
        `,
      })
      .then((res) => {
        setPokemons((pokemons) => {
          return [
            ...new Set([
              ...pokemons,
              ...res.data.species.map((b) => {
                return {
                  id: b.id,
                  name: b.name,
                  types: b.pokemons[0].types.map((type) => {
                    return type.type.name
                  }),
                };
              }),
            ]),
          ];
        });
        setHasMore(res.data.species.length > 0);
        setLoading(false);
        console.log(res.data);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  return { loading, error, pokemons, hasMore };
}
