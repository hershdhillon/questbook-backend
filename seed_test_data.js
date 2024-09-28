require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const testPersonalities = [
    {
        name: "Alice Johnson",
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express.js"]
    },
    {
        name: "Bob Smith",
        skills: ["Python", "Django", "Flask", "PostgreSQL", "Machine Learning"]
    },
    {
        name: "Charlie Brown",
        skills: ["Java", "Spring Boot", "Hibernate", "MySQL", "REST API Design"]
    },
    {
        name: "Diana Ross",
        skills: ["C#", ".NET Core", "Azure", "SQL Server", "Angular"]
    },
    {
        name: "Ethan Hunt",
        skills: ["Ruby", "Ruby on Rails", "Redis", "Sidekiq", "RSpec"]
    },
    {
        name: "Fiona Apple",
        skills: ["PHP", "Laravel", "Symfony", "MySQL", "Vue.js"]
    },
    {
        name: "George Orwell",
        skills: ["Go", "Docker", "Kubernetes", "gRPC", "Microservices"]
    },
    {
        name: "Hannah Montana",
        skills: ["Swift", "iOS Development", "Xcode", "CoreData", "UIKit"]
    },
    {
        name: "Ian McKellen",
        skills: ["Scala", "Akka", "Play Framework", "Apache Spark", "Functional Programming"]
    },
    {
        name: "Julia Child",
        skills: ["Kotlin", "Android Development", "Jetpack Compose", "Room", "Retrofit"]
    }
];

async function seedTestData() {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");

        const db = client.db("questbook");
        const personalitiesCollection = db.collection("personalities");

        // Clear existing data
        await personalitiesCollection.deleteMany({});
        console.log("Cleared existing personalities");

        // Insert test personalities
        const result = await personalitiesCollection.insertMany(testPersonalities);
        console.log(`${result.insertedCount} test personalities added successfully`);

    } catch (error) {
        console.error("Error seeding test data:", error);
    } finally {
        await client.close();
        console.log("MongoDB connection closed");
    }
}

seedTestData();
