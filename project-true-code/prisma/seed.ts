import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
  try {
    const response = await axios.get('https://dummyjson.com/products');
    const products = response.data.products;

    console.log('Seeding data started...');

    for (const product of products) {
      await prisma.products.create({
        data: {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          discountPercentage: product.discountPercentage,
          images: product.images,
        },
      });
    }

    console.log('Seeding completed successfully! 🚀');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
