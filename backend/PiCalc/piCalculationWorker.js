const { parentPort, workerData } = require('worker_threads');
const { CalculationHistory } = require('../Models/CalculationHistory');

let cancelled = false;

parentPort.on('message', (message) => {
    if (message === 'cancel') {
        cancelled = true;
    }
});

function sleep(milliseconds) {
    const sab = new SharedArrayBuffer(4);
    const int32 = new Int32Array(sab);
    Atomics.wait(int32, 0, 0, milliseconds)

}

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

function calculatePi(numberOfDigits) {
    const startTime = Date.now(); // Start time
    const piGenerator = generateDigitsOfPi();
    let pi = '3.'; // Initial value of pi

    // Skip the integer part
    piGenerator.next();
    if(numberOfDigits>1000){
        numberOfDigits = 999;
    }
    for (let i = 0; i < numberOfDigits; i++) {
        if (cancelled) {
            const duration = Date.now() - startTime; // duration cancellation
            return { content: null, id: null, duration };
        }

        pi += piGenerator.next().value;

        // Calculate progress (you might want to adjust this logic based on your actual progress calculation)
        const progress = (i / numberOfDigits) * 100;

        // Notify progress to the caller
        parentPort.postMessage({ type: 'progress', index: i, value: pi, percents: progress });
        sleep(100);
    }

    const duration = Date.now() - startTime;

    parentPort.postMessage({ type: 'result', value: pi.toString(), duration });
}

const { result, duration } = calculatePi(workerData.numberOfDigits);

if (result !== null) {
    // Save the calculation history to the database
    const userId = 5; // Replace with the actual user ID
    CalculationHistory.create({
        result: result,
        time: duration,
        isFinished: true,
        user_id: userId,
    });

    // Send the result back
    parentPort.postMessage({ content: result });
} else {
    // Handle cancellation
    parentPort.postMessage({ content: null, duration });
}
module.exports = calculatePi;