import { connect } from 'mongoose';
import axios from 'axios';
import User from './models/user.model.js';
import { config } from 'dotenv';

config();

(async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log('Connected for seeding');

    const count = await User.countDocuments();
    if (count > 0) {
      console.log('Database already seeded.');
      return process.exit(0);
    }

    const response = await axios.get('https://randomuser.me/api/?results=50&nat=us');
    const users = response.data.results.map((u) => ({
      firstName: u.name.first,
      lastName: u.name.last,
      email: u.email,
      age: u.dob.age,
      city: u.location.city,
      picture: u.picture.large,
    }));

    await User.insertMany(users);
    console.log('Seed complete with 50 users.');
    process.exit(0);
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
})();