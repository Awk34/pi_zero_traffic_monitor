# Raspberry Pi Zero Traffic Monitor

I use this code on my Raspberry Pi Zero W with the Blinkt! hat to show me the current commute time to my office.

I set it up to make the LEDs blue whenever it's fetching traffic data from the Google Maps API (so that you know it's working).
Then it will show green if the traffic is clear, yellow if it's the usual added traffic, or red if it's bad.

## Installation

```bash
npm install
```

Then `$ mv config.sample.js config.js` and then fill out the required information.

You'll need a Google Maps API key, with the Distance Matrix & Geocoding APIs enabled.

## Usage

```bash
$ node index
```

<!--## Demo-->

<!--![Video Demonstration]()-->
