require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        db = client.db("questbook");
    } catch (error) {
        console.error("Could not connect to MongoDB Atlas", error);
        process.exit(1);
    }
}

connectToDatabase();

// Add a new personality
app.post('/personalities', async (req, res) => {
    try {
        const { name, skills } = req.body;
        const result = await db.collection('personalities').insertOne({ name, skills });
        res.status(201).json({ message: 'Personality added to Questbook', personalityId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Error adding personality to Questbook' });
    }
});

// Get all personalities
app.get('/personalities', async (req, res) => {
    try {
        const personalities = await db.collection('personalities').find().toArray();
        res.json(personalities);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching personalities from Questbook' });
    }
});

// Add a new job
app.post('/jobs', async (req, res) => {
    try {
        const { title, requiredSkills } = req.body;
        const result = await db.collection('jobs').insertOne({ title, requiredSkills });
        res.status(201).json({ message: 'Job added to Questbook', jobId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Error adding job to Questbook' });
    }
});

// Get all jobs
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await db.collection('jobs').find().toArray();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching jobs from Questbook' });
    }
});

// Match job
app.post('/match-job', async (req, res) => {
    try {
        const { jobId } = req.body;
        const job = await db.collection('jobs').findOne({ _id: new ObjectId(jobId) });
        if (!job) {
            return res.status(404).json({ error: 'Job not found in Questbook' });
        }

        const personalities = await db.collection('personalities').find().toArray();

        const matches = personalities.map(personality => {
            const matchingSkills = personality.skills.filter(skill =>
                job.requiredSkills.includes(skill)
            );
            return {
                personalityId: personality._id,
                name: personality.name,
                matchingSkills,
                score: matchingSkills.length
            };
        });

        const topMatches = matches
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        res.json({ job, matches: topMatches });
    } catch (error) {
        res.status(500).json({ error: 'Error matching job in Questbook' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Questbook server running on port ${PORT}`));

process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
});
