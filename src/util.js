import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

export const sortDataHelper = (data, casesType) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a[casesType] > b[casesType] ? -1 : 1));
};

export const sortVaccineHelper = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) =>
    getVaccineNum(a.timeline, 0) > getVaccineNum(b.timeline, 0) ? -1 : 1
  );
};

// Helper functions to get vaccination numbers
export const getVaccineNum = (data, day) =>
  data[Object.keys(data)[Object.keys(data).length - 1 - day]];

// Helper function to make stats numbers look cleaner
export const beautifyStatHelper = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// For Map.js : loops through countries and draw circles on the screen
export const casesTypeColors = {
  cases: {
    hex: "#787887",
    mulitiplier: 500,
  },
  deaths: {
    hex: "#CC1034",
    mulitiplier: 3000,
  },
  recovered: {
    hex: "#7DD71D",
    mulitiplier: 500,
  },
  vaccinated: {
    hex: "#1a75ff",
    mulitiplier: 150,
  },
};

const getRadius = (casesType, countryData, vaccines) => {
  if (casesType === "vaccinated") {
    return (
      Math.sqrt(
        getVaccineNum(findVaccine(countryData.country, vaccines), 0) / 10
      ) * casesTypeColors[casesType].mulitiplier
    );
  } else {
    return (
      Math.sqrt(countryData[casesType] / 10) *
      casesTypeColors[casesType].mulitiplier
    );
  }
};

export const showDataOnMap = (data, casesType, vaccines) =>
  data.map((countryData) => (
    <Circle
      center={[countryData.countryInfo.lat, countryData.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={{
        color: casesTypeColors[casesType].hex,
        fillColor: casesTypeColors[casesType].hex,
      }}
      radius={getRadius(casesType, countryData, vaccines)}
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{
              backgroundImage: `url(${countryData.countryInfo.flag})`,
            }}
          />
          <div className="info-name">{countryData.country}</div>
          <div className="info-confirmed">
            <strong>Cases</strong>: {numeral(countryData.cases).format("0,0")}
          </div>
          <div className="info-deaths">
            <strong>Deaths</strong>: {numeral(countryData.deaths).format("0,0")}
          </div>
          <div className="info-recovered">
            <strong>Recovered</strong>:{" "}
            {numeral(countryData.recovered).format("0,0")}
          </div>
          <div className="info-vaccinated">
            <strong>Vaccinated</strong>:{" "}
            {numeral(
              getVaccineNum(findVaccine(countryData.country, vaccines), 0)
            ).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));

export const findVaccine = (countryName, vaccines) => {
  const countryVaccine = vaccines.filter(
    (vaccine) => vaccine.country === countryName
  );
  if (typeof countryVaccine[0] !== "undefined") {
    return countryVaccine[0].timeline;
  } else {
    return { 0: 0, 1: 0 }; // this is a dummy array (for getTotalVaccine)
  }
};
