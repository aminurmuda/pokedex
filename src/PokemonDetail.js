import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import styled from "styled-components";
import Tabs from "./Tabs";
import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiLink, mdiGenderMale, mdiGenderFemale } from "@mdi/js";

const Bar = styled.hr`
  /* Adapt the colors based on primary prop */
  width: ${(props) => props.length * 2.5 + "px"};
  max-width: 100%;
  border-top: 6px solid #3182ce;
  margin: 0;
`;

export default function PokemonDetail() {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemon, setPokemon] = useState(null);
  const { id } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    function fetchPokemonDetail() {
      const client = new ApolloClient({
        uri: "https://beta.pokeapi.co/graphql/v1beta",
        cache: new InMemoryCache(),
      });
      client
        .query({
          query: gql`
              query getPokemon {
                species: pokemon_v2_pokemonspecies(
                  where: { name: { _eq: "${id}" } }
                  limit: 1
                ) {
                  id
                  gender_rate
                  hatch_counter
                  name
                  description: pokemon_v2_pokemonspeciesflavortexts(
                    limit: 1
                    where: { pokemon_v2_language: { name: { _eq: "en" } } }
                  ) {
                    flavor_text
                  }
                  evolutions: pokemon_v2_evolutionchain {
                    species: pokemon_v2_pokemonspecies(order_by: { order: asc }) {
                      id
                      name
                      evolves_from_species_id
                      evolutions: pokemon_v2_pokemonevolutions {
                        min_level
                        min_affection
                        min_beauty
                        min_happiness
                        gender_id
                        time_of_day
                        move: pokemon_v2_move {
                          name
                        }
                        by_held_item: pokemonV2ItemByHeldItemId {
                          name
                        }
                        item: pokemon_v2_item {
                          name
                        }
                        evolution_trigger: pokemon_v2_evolutiontrigger {
                          name
                        }
                        location: pokemon_v2_location {
                          name
                        }
                      }
                    }
                  }
                  egg_groups: pokemon_v2_pokemonegggroups {
                    group: pokemon_v2_egggroup {
                      name
                    }
                  }
                  pokemons: pokemon_v2_pokemons {
                    id
                    name
                    height
                    weight
                    types: pokemon_v2_pokemontypes {
                      type: pokemon_v2_type {
                        name
                      }
                    }
                    abilities: pokemon_v2_pokemonabilities {
                      ability: pokemon_v2_ability {
                        name
                      }
                    }
                    stats: pokemon_v2_pokemonstats {
                      base_stat
                      stat: pokemon_v2_stat {
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
          setIsLoading(false);
          setPokemon({ ...res.data.species[0] });
        })
        .catch(() => {
          setError(true);
          setIsLoading(false);
        });
    }
    fetchPokemonDetail();
  }, [id]);

  const renderImage = () => {
    return (
      <div className="wrapper has-text-centered">
        {renderPokemonIDName()}
        <div className="layer front">
          <LazyLoadImage
            className="w-80"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`}
            effect="blur"
            alt={pokemon.name}
          />
        </div>
        <div className="layer ground"></div>
      </div>
    );
  };

  function heightConverter(number) {
    return `${number / 10} m`;
  }

  function weightConverter(number) {
    return `${number / 10} kg`;
  }

  function femaleRate(number) {
    return `${(100 * number) / 8}%`;
  }

  function maleRate(number) {
    return `${(100 * (8 - number)) / 8}%`;
  }

  function renderDescription() {
    return (
      <div className="px-1 py-2 has-background-white rounded h100vh">
        <Tabs
          tabs={[
            { name: "About", content: renderAbout() },
            { name: "Base Stats", content: renderBaseStat() },
            { name: "Evolution", content: renderEvolution() },
          ]}
        />
      </div>
    );
  }

  function renderAbout() {
    return (
      <div className="px-4">
        <p className="text">{pokemon.description[0].flavor_text}</p>
        <p className="has-text-grey-light mt-3">Height</p>
        <p>{heightConverter(pokemon.pokemons[0].height)}</p>
        <p className="has-text-grey-light mt-3">Weight</p>
        <p>{weightConverter(pokemon.pokemons[0].weight)}</p>
        <div className="is-flex align-items-center mt-3">
          <p className="has-text-grey-light">Male</p>
          <Icon path={mdiGenderMale} size={1} color="#485fc7" />
        </div>
        <p>{maleRate(pokemon.gender_rate)}</p>
        <div className="is-flex align-items-center mt-3">
          <p className="has-text-grey-light">Female</p>
          <Icon path={mdiGenderFemale} size={1} color="#c53030" />
        </div>
        <p>{femaleRate(pokemon.gender_rate)}</p>
        <p className="has-text-grey-light mt-3">Abilities</p>
        <p>{getAbilities().join(", ")}</p>
      </div>
    );
  }

  function renderBaseStat() {
    return (
      <div className="px-4">
        {getStats().map((stat) => {
          return (
            <div key={stat.name}>
              <div className="between">
                <p className="capital">{stat.name}</p>
                <p>{stat.base_stat}</p>
              </div>
              <div
                className="mt-1 mb-4"
                style={{
                  background: "#cbd5e0",
                }}
              >
                <Bar length={stat.base_stat} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderEvolution() {
    const levelingText = (level) => {
      if (!level) {
        return "";
      } else {
        return `on Level ${level}+`;
      }
    };
    return (
      <div className="has-text-centered">
        {getEvolutions().map((evo) => {
          return (
            <div className="mb-6" key={evo.name}>
              <Link to={"/detail/" + evo.name}>
                <p className="capital bold is-size-5">
                  {evo.name}

                  <Icon path={mdiLink} size={1} color="#485fc7" />
                </p>
              </Link>
              <LazyLoadImage
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evo.id}.png`}
                width="200"
              />
              <p>{levelingText(evo.min_level[0])}</p>
            </div>
          );
        })}
      </div>
    );
  }

  function getStats() {
    if (pokemon) {
      return pokemon.pokemons[0].stats.map((stat) => {
        return {
          base_stat: stat.base_stat,
          name: stat.stat.name,
        };
      });
    }
    return [];
  }
  function getEvolutions() {
    if (pokemon) {
      return pokemon.evolutions.species.map((species) => {
        return {
          name: species.name,
          min_level: species.evolutions.map((evo) => {
            return evo.min_level;
          }),
          id: species.id,
        };
      });
    }
    return [];
  }
  function getAbilities() {
    if (pokemon) {
      return pokemon.pokemons[0].abilities.map((ability) => {
        return ability.ability.name;
      });
    }
    return [];
  }
  function getTypes() {
    if (pokemon) {
      return pokemon.pokemons[0].types.map((type) => {
        return type.type.name;
      });
    }
    return [];
  }
  function getType() {
    if (pokemon) {
      return pokemon.pokemons[0].types[0].type.name;
    }
  }
  const zeroPad = (num, places) => String(num).padStart(places, "0");
  function renderPokemonIDName() {
    return (
      <div className="mt-4">
        <p className="is-size-5">#{zeroPad(pokemon.id, 3)}</p>
        <p className="is-size-5 has-text-weight-semibold capital mb-2">
          {pokemon.name}
        </p>
        {getTypes().map((type) => {
          return (
            <span
              className={
                "type-tag has-text-weight-semibold is-size-6-mobile is-size-6-desktop is-" +
                type
              }
              key={pokemon.id + "-" + type}
            >
              {type}
            </span>
          );
        })}
      </div>
    );
  }
  return (
    <div className={"container bg bg-" + getType()}>
      {!pokemon || isLoading ? (
        <div>
          <p>{error ? "Error" : ""}</p>
          <p>{isLoading ? "Loading..." : ""}</p>
        </div>
      ) : (
        <div className="relative">
          <div className="fixed pt-4">{renderImage()}</div>
          <div className="absolute">{renderDescription()}</div>
        </div>
      )}
    </div>
  );
}
