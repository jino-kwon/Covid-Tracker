import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortDataHelper = (data) => {
  const sortedData = [...data];

  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
  // or, we can do:
  // sortedData.sort((a, b) => {
  //     if (a.cases > b.cases) return -1
  //     else return 1
  // })
  // return sortedData
};

export const beautifyStatHelper = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// For Map.js : loops through countries and draw circles on the screen
const casesTypeColors = {
  cases: {
    hex: "#787887",
    mulitiplier: 500,
  },

  recovered: {
    hex: "#7DD71D",
    mulitiplier: 500,
  },

  deaths: {
    hex: "#CC1034",
    mulitiplier: 2000,
  },
};

export const showDataOnMap = (data, casesType) =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      radius={
        Math.sqrt(country[casesType] / 10) *
        casesTypeColors[casesType].mulitiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          />
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            <strong>Cases</strong>: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            <strong>Recovered</strong>:{" "}
            {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            <strong>Deaths</strong>: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
