const bcrypt = require('bcryptjs');
const { User, Recipe } = require('../models');
const { sequelize } = require('./connection');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create sample users
    const users = await Promise.all([
      User.create({
        username: 'chef_john',
        email: 'john@recipix.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Smith',
        bio: 'Professional chef with 15 years of experience',
        isVerified: true,
        role: 'admin'
      }),
      User.create({
        username: 'foodie_mary',
        email: 'mary@recipix.com',
        password: 'password123',
        firstName: 'Mary',
        lastName: 'Johnson',
        bio: 'Home cook and food blogger',
        isVerified: true
      }),
      User.create({
        username: 'baking_bob',
        email: 'bob@recipix.com',
        password: 'password123',
        firstName: 'Bob',
        lastName: 'Wilson',
        bio: 'Passionate baker and pastry chef',
        isVerified: true
      })
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create sample recipes
    const recipes = await Recipe.bulkCreate([
      {
        title: 'Classic Margherita Pizza',
        description: 'A traditional Italian pizza with fresh mozzarella, basil, and tomato sauce',
        ingredients: [
          { name: 'Pizza dough', amount: 1, unit: 'ball' },
          { name: 'Fresh mozzarella', amount: 200, unit: 'g' },
          { name: 'Fresh basil leaves', amount: 10, unit: 'leaves' },
          { name: 'Tomato sauce', amount: 100, unit: 'ml' },
          { name: 'Olive oil', amount: 2, unit: 'tbsp' }
        ],
        instructions: [
          'Preheat oven to 450°F (230°C)',
          'Roll out the pizza dough',
          'Spread tomato sauce evenly',
          'Add mozzarella slices',
          'Bake for 12-15 minutes',
          'Add fresh basil before serving'
        ],
        prepTime: 20,
        cookTime: 15,
        servings: 4,
        difficulty: 'medium',
        cuisine: 'Italian',
        tags: ['pizza', 'italian', 'vegetarian'],
        isPublic: true,
        isPublished: true,
        rating: 4.5,
        ratingCount: 25,
        viewCount: 150,
        favoriteCount: 30,
        authorId: users[0].id,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop'
      },
      {
        title: 'Chocolate Chip Cookies',
        description: 'Soft and chewy chocolate chip cookies with a crispy edge',
        ingredients: [
          { name: 'All-purpose flour', amount: 2.5, unit: 'cups' },
          { name: 'Butter', amount: 1, unit: 'cup' },
          { name: 'Brown sugar', amount: 0.75, unit: 'cup' },
          { name: 'White sugar', amount: 0.75, unit: 'cup' },
          { name: 'Eggs', amount: 2, unit: 'large' },
          { name: 'Vanilla extract', amount: 2, unit: 'tsp' },
          { name: 'Chocolate chips', amount: 2, unit: 'cups' }
        ],
        instructions: [
          'Preheat oven to 375°F (190°C)',
          'Cream butter and sugars together',
          'Add eggs and vanilla',
          'Mix in flour and chocolate chips',
          'Drop rounded tablespoons onto baking sheet',
          'Bake for 10-12 minutes'
        ],
        prepTime: 15,
        cookTime: 12,
        servings: 24,
        difficulty: 'easy',
        cuisine: 'American',
        tags: ['dessert', 'cookies', 'chocolate'],
        isPublic: true,
        isPublished: true,
        rating: 4.8,
        ratingCount: 45,
        viewCount: 300,
        favoriteCount: 75,
        authorId: users[2].id,
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop'
      },
      {
        title: 'Chicken Tikka Masala',
        description: 'Creamy and flavorful Indian curry with tender chicken',
        ingredients: [
          { name: 'Chicken breast', amount: 500, unit: 'g' },
          { name: 'Yogurt', amount: 200, unit: 'ml' },
          { name: 'Tomato sauce', amount: 400, unit: 'ml' },
          { name: 'Heavy cream', amount: 200, unit: 'ml' },
          { name: 'Onion', amount: 1, unit: 'large' },
          { name: 'Garlic', amount: 4, unit: 'cloves' },
          { name: 'Ginger', amount: 2, unit: 'tbsp' },
          { name: 'Garam masala', amount: 2, unit: 'tsp' }
        ],
        instructions: [
          'Marinate chicken in yogurt and spices',
          'Grill chicken until charred',
          'Sauté onions, garlic, and ginger',
          'Add tomato sauce and simmer',
          'Add cream and chicken',
          'Simmer until sauce thickens'
        ],
        prepTime: 30,
        cookTime: 45,
        servings: 6,
        difficulty: 'hard',
        cuisine: 'Indian',
        tags: ['curry', 'chicken', 'indian'],
        isPublic: true,
        isPublished: true,
        rating: 4.6,
        ratingCount: 35,
        viewCount: 200,
        favoriteCount: 50,
        authorId: users[1].id,
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop'
      }
    ]);

    console.log(`✅ Created ${recipes.length} recipes`);

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedData()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = seedData;
