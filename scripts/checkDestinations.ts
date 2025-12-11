import prisma from './prisma.js';

async function checkDestinations() {
  try {
    const destinations = await prisma.destination.findMany({
      where: {
        name: {
          contains: 'Know more'
        }
      }
    });
    
    console.log('Found destinations:');
    destinations.forEach(dest => {
      console.log(`- ${dest.name} (${dest.country}) - Slug: ${dest.slug}`);
    });
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDestinations();
