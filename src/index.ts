interface Job {
  id: string;
  name: string;
  priority: number;
}

const generatePriority = (amount: number): number => Math.floor(Math.random() * amount);

const getJobs = (amount: number): Job[] =>
  [...Array(amount).keys()]
  .map((el: number): Job => ({
    id: `${el}`,
    name: `Job id: ${el}`,
    priority: generatePriority(amount),
  }));

const jobHeapSmall: Job[] = getJobs(100);
const jobHeapMedium: Job[] = getJobs(5000);
const jobHeapLarge: Job[] = getJobs(10000);

class CircularJobRunner {
  private buffer: Uint16Array;
  private queue: Job[];
  private activeJobs: Set<string>;
  private nextSlot: number = 0;
  private start: number = performance.now();

  constructor(private bufferSize: number, private priorities: number[]) {
    this.buffer = new Uint16Array(bufferSize);
    this.queue = [];
    this.activeJobs = new Set();
  }

  enqueue(job: Job): void {
    if (this.activeJobs.has(job.id)) {
      // Job is already active
      return;
    }

    if (this.queue.some((j) => j.id === job.id)) {
      // Job is already enqueued
      return;
    }

    if (this.queue.length >= this.bufferSize) {
      // Buffer is full
      console.log('Buffer is full');
      return;
    }

    this.queue.push(job);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  run(): void {
    const runNextJob = (): void => {
      const job = this.queue.shift();

      if (!job) {
        // Queue is empty
        const end = performance.now();

        console.log('End execution');
        console.log(`Execution time for Heap size ${this.bufferSize}: ${end - this.start} ms`);
        return;
      }

      const slot = this.getNextSlot();

      if (slot === -1) {
        // No available slots in the buffer
        this.queue.unshift(job);
        return;
      }

      this.activeJobs.add(job.id);
      this.buffer[slot] = this.priorities.indexOf(job.priority) + 1;

      const onJobDone = (): void => {
        this.activeJobs.delete(job.id);
        this.buffer[slot] = 0;
        runNextJob();
      };

      // Execute the job
      setTimeout(() => {
        console.log(`Job name: ${job.name}, priority: ${job.priority}`);
        onJobDone();
      }, 0);
    };

    runNextJob();
  }

  private getNextSlot(): number {
    const startIndex = this.nextSlot;

    while (this.buffer[this.nextSlot] !== 0) {
      this.nextSlot = (this.nextSlot + 1) % this.bufferSize;

      if (this.nextSlot === startIndex) {
        // Buffer is full
        return -1;
      }
    }

    const slot = this.nextSlot;
    this.nextSlot = (this.nextSlot + 1) % this.bufferSize;
    return slot;
  }
}

const checkRunner = (heap: Job[]): void => {
  const runner = new CircularJobRunner(heap.length, heap.map(el => el.priority));

  heap.forEach(el => runner.enqueue(el));

  runner.run();
}

checkRunner(jobHeapSmall);
