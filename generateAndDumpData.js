const { MongoClient } = require('mongodb');
const faker = require('faker');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

// MongoDB Connection URL from environment variable
const url = process.env.MONGO_DB_HOST + '/' + process.env.MONGO_DB_NAME;
const userCollectionName = 'users';
const blogCollectionName = 'blogs';

// Function to generate a random image URL using Lorem Picsum
async function getRandomImageUrl() {
  try {
    const response = await axios.get('https://picsum.photos/600/400');
    return response.request.res.responseUrl; // Return the generated image URL
  } catch (error) {
    console.error('Error fetching image:', error);
    return ''; // Return an empty string if there's an error
  }
}

// Generate dummy data for User
function generateUser() {
  return {
    email: faker.internet.email(),
    name: faker.name.findName(),
    picture: faker.internet.avatar(),
  };
}

// Generate dummy data for Blog
async function generateBlog(userId) {
  const imageUrlList = await Promise.all([
    getRandomImageUrl(),
    getRandomImageUrl(),
  ]);

  // Generate HTML content with structured sections
  const htmlContent = `
    <h1>The three greatest things you learn from traveling</h1>
    <p>Like all the great things on earth traveling teaches us by example. Here are some of the most precious lessons I’ve learned over the years of traveling.</p>
    
    <img src="${imageUrlList[0]}" alt="Lone wanderer at Mount Bromo" style="width: 100%; height: auto;">
    
    <h2>Leaving your comfort zone might lead you to such beautiful sceneries like this one.</h2>
    <p>A lone wanderer looking at Mount Bromo volcano in Indonesia.</p>
    
    <h2>Appreciation of diversity</h2>
    <p>Getting used to an entirely different culture can be challenging. While it’s also nice to learn about cultures online or from books, nothing comes close to experiencing cultural diversity in person. You learn to appreciate each and every single one of the differences while you become more culturally fluid.</p>
    <blockquote>"The real voyage of discovery consists not in seeking new landscapes, but having new eyes." - Marcel Proust</blockquote>
    
    <h2>Improvisation</h2>
    <p>Life doesn't allow us to execute every single plan perfectly. This especially seems to be the case when you travel. You plan it down to every minute with a big checklist. But when it comes to executing it, something always comes up and you’re left with your improvising skills. You learn to adapt as you go. Here’s how my travel checklist looks now:</p>
    <ul>
      <li>Buy the ticket</li>
      <li>Start your adventure</li>
    </ul>
    
    <img src="${imageUrlList[1]}" alt="Three monks ascending the stairs of an ancient temple" style="width: 100%; height: auto;">
    
    <h2>Confidence</h2>
    <p>Going to a new place can be quite terrifying. While change and uncertainty make us scared, traveling teaches us how ridiculous it is to be afraid of something before it happens. The moment you face your fear and see there is nothing to be afraid of, is the moment you discover bliss.</p>
  `;

  return {
    title: faker.lorem.sentence(),
    content: htmlContent,
    user: userId,
    createdAt: new Date(),
  };
}

async function dumpData() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(); // Automatically uses the database specified in the URL
    const userCollection = db.collection(userCollectionName);
    const blogCollection = db.collection(blogCollectionName);

    // Insert dummy user data
    const userResult = await userCollection.insertOne(generateUser());
    const userId = userResult.insertedId;
    console.log(`User document inserted with _id: ${userId}`);

    // Generate and insert dummy blog data
    const blogs = [];
    for (let i = 0; i < 25; i++) {
      const blog = await generateBlog(userId);
      blogs.push(blog);
    }
    const blogResult = await blogCollection.insertMany(blogs);
    console.log(`${blogResult.insertedCount} blog documents were inserted`);
  } catch (err) {
    console.error(err.stack);
  } finally {
    // Close the connection
    await client.close();
  }
}

dumpData().catch(console.dir);
