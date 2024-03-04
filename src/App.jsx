import './App.css';
import map from './assets/world_map.png';
import axios from 'axios';
import {useState} from 'react';
import getRegionColors from './helpers/getRegionColors.js';
import population from './helpers/population.js';

function App() {

    const [countries, setCountries] = useState([]);
    const [searchCountry, setSearchCountry] = useState('');
    const [countryInfo, setCountryInfo] = useState({});
    const [error, setError] = useState('');

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

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${searchCountry}`);
            const country = response.data[0];
            setCountryInfo(country);
            setSearchCountry('');
        } catch (e) {
            console.error(e);
            setError(`${searchCountry} bestaat niet. Probeer het opnieuw.`);
        }
    }

    async function getCountry(getCountry){
        console.log(getCountry);
        setError('');
        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${getCountry}`);
            const country = response.data[0];
            console.log(countryInfo);
            setCountryInfo(country);
            const element = document.querySelector(`.search-form`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } catch (e) {
            console.error(e);
            setError(`${getCountry} bestaat niet. Probeer het opnieuw.`);
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
                        <>
                            <h2>Search country information</h2>
                            <form className="search-form" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="query"
                                    id="query-field"
                                    placeholder="Bijvoorbeeld Nederland of Peru"
                                    value={searchCountry}
                                    onChange={(event) => setSearchCountry(event.target.value)}
                                />
                                <button type="submit">Zoek</button>
                                {error && <span id="error-message">{searchCountry} bestaat niet. Probeer het opnieuw</span>}
                            </form>
                            {Object.keys(countryInfo).length > 0 &&
                                <article className="search-result-box">
                            <span className="flag-title-container">
                              <img src={countryInfo.flags.svg} alt="vlag" className="flag"/>
                              <h2>{countryInfo.name.common}</h2>
                            </span>
                                    <p>{`${countryInfo.subregion ? countryInfo.name.common + " is situated in " + countryInfo.subregion : ""} ${countryInfo.capital ? "and the capital is " + countryInfo.capital[0]+"." : ""}` }</p>
                                    <p>{`${ countryInfo.population ? "It has a population of " + population(countryInfo.population) + " people" : ""}  ${countryInfo.borders ? "and it borders with "+ countryInfo.borders.length + " neighboring countries." : "."}`}</p>
                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                    <p>Websites can be found on <code>{`${countryInfo.tld ? countryInfo.tld[0] : " Onbekend "}`}</code> domain's.</p>
                                </article>
                            }
                            <ul className="country-list">
                                {countries.map((country) => {
                                    return (
                                        <li key={country.name.common}>
                                            <div className="clickEvent" onClick={() => getCountry(country.name.common)}>
                                                <img src={country.flags.svg} alt={country.name.common}
                                                     className="flag"/>
                                                <p className={`${getRegionColors(country.region)} country`}>{country.name.common}</p>
                                            </div>
                                            <p className="population">Has a population
                                                of {country.population} people</p>
                                            <p className="population">{country.region}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </>
                        : <button type="button" onClick={fetchCountries} className="btn">Alle landen ophalen</button>}
                </section>
            </main>
        </>
    )
}

export default App
