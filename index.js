const Blinkt = require('./blinkt');
const maps = require('@google/maps');
const config = require('./config');

const leds = new Blinkt();
const googleMapsClient = maps.createClient({
  key: config.GOOGLE_MAPS_KEY,
  Promise,
});

leds.setup();
leds.clearAll();
leds.setAllPixels(13, 247, 255, 0.05);
leds.sendUpdate();

function geocode(address) {
    return googleMapsClient.geocode({address})
        .asPromise()
        .then(res => {
            if(res.json.status !== 'OK') return Promise.reject(res.json.results);

            return res.json.results[0].geometry.location;
        });
}

function distanceMatrix(query) {
    return googleMapsClient.distanceMatrix(query)
        .asPromise()
        .then(res => {
            if(res.json.status !== 'OK') return Promise.reject(res.json.results);

            return res.json.rows[0].elements[0];
        });
}

function update(origin, destination) {
    // Set LEDs to blue (so we know it's grabbing data)
    leds.setAllPixels(13, 247, 255, 0.05);
    leds.sendUpdate();

    return distanceMatrix({
        units: 'imperial',
        mode: 'driving',
        departure_time: 'now',
        traffic_model: 'best_guess',
        origins: [origin],
        destinations: [destination],
    }).then(({status, duration_in_traffic/*, distance, duration*/}) => {
        console.log(status);
        console.log(duration_in_traffic.text);

        // TODO: instead of turning all LEDs on, encode the drive time minutes to binary on the LEDs

        if(duration_in_traffic.value < 19 * 60) {
            leds.setAllPixels(0, 156, 0, 0.05);
            leds.sendUpdate();
        } else if(duration_in_traffic.value < 24 * 60) {
            leds.setAllPixels(210, 200, 0, 0.05);
            leds.sendUpdate();
        } else {
            leds.setAllPixels(255, 5, 5, 0.05);
            leds.sendUpdate();
        }
    }).catch(err => {
        console.error(err);

        process.exit(1);
    });
}

Promise.all([
    geocode(config.origin),
    geocode(config.destination),
]).then(([origin, destination]) => {
    update(origin, destination);

    setInterval(() => {
        update(origin, destination);
    }, 30 * 1000);
}).catch(err => {
    console.error(err);

    process.exit(1);
});
