import React, { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import "./App.css";
import InfoBox from "./components/InfoBox/InfoBox";
import Map from "./components/Map/Map";
import "leaflet/dist/leaflet.css";
import Table from "./components/Table/Table";
import {
  sortDataHelper,
  sortVaccineHelper,
  beautifyStatHelper,
  getVaccineNum,
} from "./util";
import LineGraph from "./components/LineGraph/LineGraph";
import "./components/InfoBox/InfoBox.css";
{
  /* following BEM naming convention */
}

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [vaccineInfo, setVaccineInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapVaccines, setMapVaccines] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [tableVaccine, setTableVaccine] = useState([]);

  // Fetching 'worldwide' data for the initial page
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
    // for vaccination data
    fetch("https://disease.sh/v3/covid-19/vaccine/coverage")
      .then((response) => response.json())
      .then((data) => {
        setVaccineInfo(data);
      });
  }, []);
  // useEffect for fetching country data
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country, // United States, United Kingdom..
            value: country.countryInfo.iso2, // USA,UK,..
          }));
          let sortedData = sortDataHelper(data, casesType);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
      await fetch("https://disease.sh/v3/covid-19/vaccine/coverage/countries/")
        .then((response) => response.json())
        .then((data) => {
          let sortedData = sortVaccineHelper(data);
          setTableVaccine(sortedData);
          setMapVaccines(data);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        countryCode === "worldwide"
          ? setMapCenter([34.80746, -40.4796])
          : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
    // for vaccination data (sourced from a different url)
    const vaccineUrl =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=140"
        : `https://disease.sh/v3/covid-19/vaccine/coverage/countries/${countryCode}?lastdays=140`;

    await fetch(vaccineUrl)
      .then((response) => response.json())
      .then((data) => {
        if (countryCode === "worldwide") setVaccineInfo(data);
        else if (typeof data.timeline !== "undefined")
          setVaccineInfo(data.timeline);
        else setVaccineInfo({ 0: 0, 1: 0 }); // this is a dummy array (for 'getVaccineNum')
      });
  };
  return (
    <div className="app">
      <div className="app__left">
        {/* Header */}
        <div className="app__header">
          <h1>COVID DATA TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Look through all the counties */}
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            title="Cases"
            onClick={(event) => setCasesType("cases")}
            active={casesType === "cases"}
            cases={beautifyStatHelper(countryInfo.todayCases)}
            total={beautifyStatHelper(countryInfo.cases)}
          />
          <InfoBox
            title="Deaths"
            onClick={(event) => setCasesType("deaths")}
            active={casesType === "deaths"}
            cases={beautifyStatHelper(countryInfo.todayDeaths)}
            total={beautifyStatHelper(countryInfo.deaths)}
          />
          <InfoBox
            title="Recovered"
            onClick={(event) => setCasesType("recovered")}
            active={casesType === "recovered"}
            cases={beautifyStatHelper(countryInfo.todayRecovered)}
            total={beautifyStatHelper(countryInfo.recovered)}
          />
          <InfoBox
            title="Vaccinated"
            onClick={(event) => setCasesType("vaccinated")}
            active={casesType === "vaccinated"}
            cases={beautifyStatHelper(
              getVaccineNum(vaccineInfo, 1) - getVaccineNum(vaccineInfo, 2)
            )} // get today's vaccine data : ( today's cases - yesterday's cases)
            total={beautifyStatHelper(getVaccineNum(vaccineInfo, 0))}
          />
        </div>

        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          vaccines={mapVaccines}
          casesType={casesType}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Total {casesType} (high — low)</h3>
          <Table
            countries={tableData}
            casesType={casesType}
            vaccines={tableVaccine}
          />
          <h3 className="app__graphName">Worldwide data (past 140 days)</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
