import React, { useState, useEffect } from "react"
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core'
import './App.css'
import InfoBox from './components/InfoBox/InfoBox'
import Map from './components/Map/Map'
import Table from './components/Table/Table'
import { sortDataHelper } from './util'
{/* following BEM naming convention */}

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('worldwide')
  const [countryInfo, setCountryInfo] = useState({})
  const [tableData, setTableData] = useState([])

  // useEffect for fetching country data
  useEffect(() => {
    const getCountriesData = async()=> {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=> response.json())
      .then((data)=> {
        const countries = data.map((country)=> ({
          name: country.country, // United States, United Kingdom..
          value: country.countryInfo.iso2 // USA,UK,..
        }))

        const sortedData = sortDataHelper(data)
        setTableData(sortedData)
        setCountries(countries)
      })
    }
    getCountriesData(countries);
  }, [])
// useEffect for worldwide data for the initial page
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data)
    })
  }, [])

  const onCountryChange = async(event)=> {
    const countryCode = event.target.value
    setCountry(countryCode)

    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    await fetch(url)
    .then(response => response.json())
    .then(data => {
      setCountry(countryCode)
      setCountryInfo(data)
    })
  }

  return (
    <div className="app"> 
      <div className="app__left">
        {/* Header */}
        <div className="app__header"> 
          <h1>COVID DATA TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Look through all the counties */}
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}            
              {/* 
              <MenuItem value="worldwide">Option four</MenuItem> */}
            </Select>
          </FormControl>
        </div>
        {/* InfoBoxes */}      
        <div className="app__stats">
          <InfoBox title="Cases" today={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" today={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" today={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>

        
        <Map />
      </div>

      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          {/* Map */}
          <h3>Worldwide new cases</h3>
          
        </CardContent>
      </Card>
    </div>
  );
}

export default App
