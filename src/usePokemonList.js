import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export default function usePokemonList(pageNumber = 1, online) {
  const client = new ApolloClient({
    uri: "https://beta.pokeapi.co/graphql/v1beta",
    cache: new InMemoryCache(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pokemons, setPokemons] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  function setPokemonHelper(res) {
    setPokemons((pokemons) => {
      return [
        ...new Set([
          ...pokemons,
          ...res.data.species.map((b) => {
            return {
              id: b.id,
              name: b.name,
              types: b.pokemons[0].types.map((type) => {
                return type.type.name;
              }),
            };
          }),
        ]),
      ];
    });
    setHasMore(res.data.species.length > 0);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    setError(false);
    const offset = (pageNumber - 1) * 20;
    const key = `pokemons-offset-${offset}`;
    const isDataAvailable = localStorage.getItem(key);
    if (isDataAvailable) {
      const res = JSON.parse(isDataAvailable);
      setPokemonHelper(res);
    } else if (!isDataAvailable && online) {
      client
        .query({
          query: gql`
          query getPokemons {
            species: pokemon_v2_pokemonspecies(
              limit: 20
              offset: ${offset}
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
          localStorage.setItem(key, JSON.stringify(res));
          setPokemonHelper(res);
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, online]);

  return { loading, error, pokemons, hasMore };
}
