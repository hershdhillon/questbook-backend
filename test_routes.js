const axios = require('axios');

const BASE_URL = 'http://localhost:3000'; // Change this if your server is running on a different port or URL

async function testRoutes() {
    try {
        console.log('Testing Questbook routes...');

        // Test adding personalities
        console.log('\nAdding personalities:');
        const personality1 = await axios.post(`${BASE_URL}/personalities`, {
            name: 'Alice',
            skills: ['JavaScript', 'React', 'Node.js']
        });
        console.log('Added personality 1:', personality1.data);

        const personality2 = await axios.post(`${BASE_URL}/personalities`, {
            name: 'Bob',
            skills: ['Python', 'Django', 'Machine Learning']
        });
        console.log('Added personality 2:', personality2.data);

        // Test getting all personalities
        console.log('\nGetting all personalities:');
        const allPersonalities = await axios.get(`${BASE_URL}/personalities`);
        console.log('All personalities:', allPersonalities.data);

        // Test adding jobs
        console.log('\nAdding jobs:');
        const job1 = await axios.post(`${BASE_URL}/jobs`, {
            title: 'Frontend Developer',
            requiredSkills: ['JavaScript', 'React']
        });
        console.log('Added job 1:', job1.data);

        const job2 = await axios.post(`${BASE_URL}/jobs`, {
            title: 'Data Scientist',
            requiredSkills: ['Python', 'Machine Learning']
        });
        console.log('Added job 2:', job2.data);

        // Test getting all jobs
        console.log('\nGetting all jobs:');
        const allJobs = await axios.get(`${BASE_URL}/jobs`);
        console.log('All jobs:', allJobs.data);

        // Test matching job
        console.log('\nMatching job:');
        const jobMatch = await axios.post(`${BASE_URL}/match-job`, {
            jobId: job1.data.jobId
        });
        console.log('Job match result:', jobMatch.data);

        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('An error occurred during testing:', error.response ? error.response.data : error.message);
    }
}

testRoutes();
