import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";
import { casesTypeColors } from "../../util";

const buildChart = (data, casesType) => {
  let chartData = [];
  let prevData;
  for (let date in data.cases) {
    if (prevData) {
      let newData = {
        x: date,
        y: data[casesType][date] - prevData,
      };
      chartData.push(newData);
    }
    prevData = data[casesType][date];
  }
  return chartData;
};

const buildVaccineChart = (data) => {
  let chartData = [];
  let prevData;
  for (let date in data) {
    if (prevData) {
      let newData = {
        x: date,
        y: data[date] - prevData,
      };
      chartData.push(newData);
    }
    prevData = data[date];
  }
  return chartData;
};

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: { radius: 0 },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

function LineGraph({ casesType, ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      if (casesType === "vaccinated") {
        await fetch(
          "https://disease.sh/v3/covid-19/vaccine/coverage?lastdays=140"
        )
          .then((response) => response.json())
          .then((data) => {
            let chartData = buildVaccineChart(data);
            setData(chartData);
          });
      } else {
        await fetch(
          "https://disease.sh/v3/covid-19/historical/all?lastdays=140"
        )
          .then((response) => response.json())
          .then((data) => {
            let chartData = buildChart(data, casesType);
            setData(chartData);
          });
      }
    };
    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                label: casesType,
                fill: false,
                backgroundColor: "white",
                borderColor: casesTypeColors[casesType].hex,
                data: data,
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "white",
                pointBackgroundColor: casesTypeColors[casesType].hex,
                pointBorderWidth: 1,
                pointHoverRadius: 8,
                pointHoverBackgroundColor: "black",
                pointHoverBorderColor: "white",
                pointHoverBorderWidth: 2,
                pointRadius: 3,
                pointHitRadius: 10,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;
