import {Driver} from "../interfaces/driver.interface";
import {Shipment} from "../interfaces/shipment.interface";
export function calculateBaseScore(name: string, length: number): number {
    const vowels = ["a", "e", "i", "o", "u"];
    let count = 0;

    for (const char of name.toLowerCase()) {
        if (vowels.includes(char)) {
            count += 1.5;
        } else {
            count += 1;
        }
    }

    return count * (length % 2 === 0 ? 1.5 : 1);
}

export function hasCommonFactors(a: number, b: number): boolean {
    for (let i = 2; i <= Math.min(a, b); i++) {
        if (a % i === 0 && b % i === 0) {
            return true;
        }
    }
    return false;
}

export function assignShipmentsToDrivers(
    drivers: Driver[],
    shipments: Shipment[]
): [number, { [destination: string]: string }] {
    const result: { [destination: string]: string } = {};
    let totalScore = 0;

    for (const shipment of shipments) {
        const eligibleDrivers = drivers.filter((driver) => !driver.shipment);
        let bestScore = -Infinity;
        let bestDriver: Driver | undefined;

        for (const driver of eligibleDrivers) {
            const score = calculateScore(driver, shipment);

            if (score > bestScore) {
                bestScore = score;
                bestDriver = driver;
            }
        }

        if (bestDriver) {
            bestDriver.shipment = shipment.destination;
            shipment.driver = bestDriver.name;
            result[shipment.destination] = bestDriver.name;
            totalScore += bestScore;
        }
    }

    return [totalScore, result];
}

function calculateScore(driver: Driver, shipment: Shipment): number {
    let score = driver.baseScore;

    if (hasCommonFactors(driver.name.length, shipment.destination.length)) {
        score *= 1.5;
    }
    return score;
}