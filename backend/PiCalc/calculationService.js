const { Worker } = require('worker_threads');
const path = require('path');

class CalculationService {
    constructor() {
        this.workers = new Map();
        this.currentId = 0;
        this.maxWorkers = 3;
        this.calculatePi = this.calculatePi.bind(this);
    }

    calculatePi(numberOfDigits, onProgress) {
        if (this.workers.size === this.maxWorkers) {
            return Promise.reject(new Error('The maximum number of workers has been reached.'));
        }

        return new Promise((resolve, reject) => {
            const id = this.currentId + 1;
            this.currentId++;
            const workerPath = path.resolve(__dirname, 'piCalculationWorker.js');
            const worker = new Worker(workerPath, { workerData: { numberOfDigits } });
            this.workers.set(id, worker);

            worker.on('message', (message) => {
                if (message.type === 'progress') {
                    onProgress({...message, id});
                }else if (message === 'cancel') {

                    this.cleanUpWorker(id);
                    reject(new Error('Calculation cancelled by user.'));
                } else if (message.type === 'result') {
                    resolve({ ...message, id });
                    this.cleanUpWorker(id);
                }
            });

            worker.on('error', () => {
                console.error('Worker error:');
                this.workers.delete(id);
                reject();
            });


            worker.on('exit', (code) => {
                this.workers.delete(id);
                if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
            });
        });
    }

    cancelCalculation() {
        const worker = this.workers.get(this.currentId);
        if (worker) {
            worker.postMessage('cancel');
            return true;
        }
        return false;
    }

    cleanUpWorker(id) {
        const worker = this.workers.get(id);
        if (worker) {
            worker.terminate();
            this.workers.delete(id);
        }
    }
}

module.exports = CalculationService;
