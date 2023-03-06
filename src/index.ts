import {assignShipmentsToDrivers, calculateBaseScore} from "./logic/shipmentCalculations";

const nReadlines = require('n-readlines');
import {Driver} from "./interfaces/driver.interface";
import {Shipment} from "./interfaces/shipment.interface";

const driverFile = process.argv[2];
const addressFile = process.argv[3];

const driversParsed: Driver[] = [];
const shipmentsParsed: Shipment[] = [];

const driversLiner = new nReadlines(driverFile);
let driversLine;
while (driversLine = driversLiner.next()) {
    driversParsed.push({name: driversLine.toString('ascii'), baseScore: 0});
}

const shipmentsLiner = new nReadlines(addressFile);
let shipmentsLine;
while (shipmentsLine = shipmentsLiner.next()) {
    shipmentsParsed.push({destination: shipmentsLine.toString('ascii'), baseScore: 0});
}

// Calculate base scores

for (const driver of driversParsed) {
    driver.baseScore = calculateBaseScore(driver.name, driver.name.length);
}

for (const shipment of shipmentsParsed) {
    shipment.baseScore = calculateBaseScore(
        shipment.destination,
        shipment.destination.length
    );
}

// Assign shipments to drivers

const [totalScore, assignments] = assignShipmentsToDrivers(driversParsed, shipmentsParsed);

console.log("Total SS:", totalScore);
console.log("Assignments:", assignments);
console.table(assignments);