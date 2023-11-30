
const User = require('../models/User')
const Role = require('../models/Role')
const CalculationHistory = require('../Models/CalculationHistory');
const Big = require('big.js');
function* generateDigitsOfPi() {
    let q = BigInt(1);
    let r = BigInt(180);
    let t = BigInt(60);
    let i = BigInt(2);

    while (true) {
        let digit = ((i * BigInt(27) - BigInt(12)) * q + r * BigInt(5)) / (t * BigInt(5));
        yield Number(digit);

        let u = i * BigInt(3);
        u = (u + BigInt(1)) * BigInt(3) * (u + BigInt(2));
        r = u * BigInt(10) * (q * (i * BigInt(5) - BigInt(2)) + r - t * digit);
        q *= BigInt(10) * i * (i++ * BigInt(2) - BigInt(1));
        t *= u;

    }
}

// Handle the communication with the main thread
onmessage = (event) => {
    const { numberOfDigits } = event.data;

    // Perform the pi calculation
    const piGenerator = generateDigitsOfPi();
    let pi = '3.';
    piGenerator.next(); // Skip the integer part

    for (let i = 0; i < numberOfDigits; i++) {
        pi += piGenerator.next().value;
    }

    // Send the result back to the main thread
    postMessage({ content: pi });
};