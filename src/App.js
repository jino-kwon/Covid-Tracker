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
import { sortDataHelper, beautifyStatHelper } from "./util";
import LineGraph from "./components/LineGraph/LineGraph";
import "./components/InfoBox/InfoBox.css";
{
  /* following BEM naming convention */
}

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

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
          let sortedData = sortDataHelper(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };
    getCountriesData();
  }, []);
  // useEffect for worldwide data for the initial page
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

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
        {/* InfoBoxes */}
        <div className="app__stats">
          <InfoBox
            isGrey
            title="Cases"
            onClick={(event) => setCasesType("cases")}
            active={casesType === "cases"} // this is for highlighting infoBox
            cases={beautifyStatHelper(countryInfo.todayCases)}
            total={beautifyStatHelper(countryInfo.cases)}
          />
          <InfoBox
            isRed
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
        </div>

        <Map
          center={mapCenter}
          zoom={mapZoom}
          countries={mapCountries}
          casesType={casesType}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases</h3>
          <Table countries={tableData} />
          <h3 className="app__graphName">Worldwide new {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
