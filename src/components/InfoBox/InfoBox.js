import React from "react";
import "./InfoBox.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function infoBox({ title, cases, total, active, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--grey"} 
      ${title === "Deaths" && "infoBox--red"}
      ${title === "Recovered" && "infoBox--green"}
      ${title === "Vaccinated" && "infoBox--blue"}`}
    >
      <CardContent>
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>

        <h2
          className={`infoBox__grey
          ${title === "Deaths" && "infoBox__red"} 
          ${title === "Recovered" && "infoBox__green"}
          ${title === "Vaccinated" && "infoBox__blue"}`}
        >
          {cases}
        </h2>

        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default infoBox;
