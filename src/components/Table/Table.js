import React from "react";
import "./Table.css";
import numeral from "numeral";
import { getVaccineNum, sortDataHelper } from "../../util";

function Table({ casesType, countries, vaccines }) {
  if (casesType !== "vaccinated") {
    let sortedCountries = sortDataHelper(countries, casesType);
    return (
      <div className="table">
        {sortedCountries.map((country) => (
          <tr>
            <td>{country.country}</td>
            <td>
              <strong>{numeral(country[casesType]).format("0,0")}</strong>
            </td>
          </tr>
        ))}
      </div>
    );
  } else {
    return (
      <div className="table">
        {vaccines.map((vaccine) => (
          <tr>
            <td>{vaccine.country}</td>
            <td>
              <strong>
                {numeral(getVaccineNum(vaccine.timeline, 0)).format("0,0")}
              </strong>
            </td>
          </tr>
        ))}
      </div>
    );
  }
}

export default Table;
