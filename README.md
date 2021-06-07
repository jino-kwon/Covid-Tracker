# COVID DATA TRACKER

In 2021, the world is still fighting against coronavirus while a growing number of people are vaccinated. I have faith that a growing rate of vaccination (of course, on top of social-distancing and various social endeavors) will help us overcome this crisis.
Although there are many helpful data trackers out there, _not many of existing trackers allow me to see coronavirus data and vaccination data right next to each other (on the same page)_.
This is probably because (as of April 29, 2021 when I started this project) it hasn't been long since the general public in the US became eligible to take covid vaccines, not to mention the people in the other parts of the world.
I hope that this tracker is useful to you.

**See the demo here** : *https://covid-tracker-ccad9.web.app*

**Tech Stack** :

- React (frontend)
- React-leaflet (map)
- Chart.js (data visualization - line graph)
- Material-ui (UI design)
- Firebase (deployment)

**Data** : Using _disease.sh_'s API,

- new cases/recovered/deaths data were sourced from _Worldometers_
- time series data for all countries were sourced from _Johns Hopkins University_
- vaccination rates data were sourced from *https://covid.ourworldindata.org/*
