import React, { useState } from "react";
import axios from "axios";
import PokemonInfo from "./components/PokemonInfo";
import pokeballIcon from "./pokeball_icon.svg";
import "./App.css";

function App() {
  /** Marks if the data is currently being retrieved. */
  const [isLoading, setIsLoading] = useState(true);
  /** Intended for the first run, tracks if a query has been submitted before.
   * Used to determine if 'tutorial' message should be shown. */
  const [isQueryAvailable, setIsQueryAvailable] = useState(false);
  /** Marks the Pokemon being requested. */
  const [pokemon, setPokemon] = useState("");
  /** Marks the Pokemon query input from the user (before submit). */
  const [pokemonQuery, setPokemonQuery] = useState("");
  /** Holds the API data for the pokemon. */
  const [pokemonData, setPokemonData] = useState([]);
  /** Holds the Pokemon's energy type for easy access, taken from API data. */
  const [pokemonType, setPokemonType] = useState("");

  /** Modifies the {@link pokemonQuery} to reflect changes in user input. */
  const handleSearchBoxChange = (e) => {
    setPokemonQuery(e.target.value.toLowerCase());
  };

  /** Handles tasks when the user submits a Pokemon query. */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsQueryAvailable(true);
    setIsLoading(true);
    getPokemonData();
  };

  /** Retrieves the Pokemon's API data using the query given by the user. */
  const getPokemonData = async () => {
    /* Using pokemonQuery here so that the previous valid data is shown
    if an error occurs while querying new data from the API */
    const ENDPOINT = "https://pokeapi.co/api/v2/pokemon/" + pokemonQuery;
    const pokemonDataArray = [];
    axios(ENDPOINT)
      .then((res) => {
        setIsLoading(false);
        console.info("POKEMON API RESPONSE:\n", res);

        if (res.data) {
          pokemonDataArray.push(res.data);
          setPokemonType(res.data.types[0].type.name);
          setPokemon(res.data.forms[0].name);
          console.warn(res.data.types[0].name);
          setPokemonData(pokemonDataArray);
        } else {
          console.error("Pokemon data not found!");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        // TODO: Display error in HTML instead of alerts.
        alert(
          "An error occured while retrieving Pokemon data:\n" +
            err.code +
            "\nCheck your spelling, and ensure you are connected to the internet."
        );
        console.error("An error occured while retrieving Pokemon data:\n", err);
      });
  };

  // TODO: Animated loading? e.g. dots bounce up
  const pokemonAPIContent = !isQueryAvailable ? (
    <div>Enter a Pokemon to see its data!</div>
  ) : isLoading ? (
    <div>Fetching data...</div>
  ) : (
    <div>
      {pokemonData.map((data) => {
      return (
          <PokemonInfo 
            name={pokemon} 
            type={pokemonType} 
            sprite={data.sprites.front_default} />
        );
      })}
    </div>
  );

  return (
    <div className="App">
      <div className="Title-navbar">
        <img src={pokeballIcon} className="Title-logo" alt="logo" />
        <h1>pokédex-js</h1>
      </div>
      <div className="App-content">
        <form onSubmit={handleFormSubmit}>
          <label>
            <input
              placeholder="Pokémon name"
              onChange={handleSearchBoxChange}
              type="text"
              role="searchbox"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              required
            />
          </label>
        </form>
        {pokemonAPIContent}
      </div>
    </div>
  );
}

export default App;
