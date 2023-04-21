import { Job, getJobs } from './mock';

const jobHeapSmall: Job[] = getJobs(200);
const jobHeapMedium: Job[] = getJobs(1000);
const jobHeapLarge: Job[] = getJobs(10000);
