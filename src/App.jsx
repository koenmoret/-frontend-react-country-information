import './App.css';
import map from './assets/world_map.png';
import axios from 'axios';
import {useState} from 'react';
import getRegionColors from './helpers/getRegionColors.js';

function App() {

    const [countries, setCountries] = useState([]);

    async function fetchCountries() {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            console.log(response.data);

            response.data.sort((a, b) => {
                return a.population - b.population;
            });

            setCountries(response.data);

        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <header>
                <img src={map} alt="Wereldkaart" className="map"/>
            </header>
            <main>
                <section className="inner-container">
                    <h2>World Regions</h2>
                    {countries.length > 0 ?
                        <ul className="country-list">
                            {countries.map((country) => {
                                return (
                                    <li key={country.name.common}>
                                        <div>
                                            <img src={country.flags.svg} alt={country.name.common} className="flag"/>
                                            <p className={`${getRegionColors(country.region)} country`}>{country.name.common}</p>
                                        </div>
                                        <p className="population">Has a population of {country.population} people</p>
                                        <p className="population">{country.region}</p>
                                    </li>
                                )
                            })}
                        </ul>
                        : <button type="button" onClick={fetchCountries} className="btn">Alle landen ophalen</button>}
                </section>
            </main>
        </>
    )
}

export default App
