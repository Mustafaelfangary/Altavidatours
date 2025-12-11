// scripts/updateDestination.ts
import prisma from './prisma.js';

async function updateDestination() {
  try {
    const updated = await prisma.destination.updateMany({
      where: {
        name: 'Know more with Memphis'
      },
      data: {
        name: 'Know more with AltaVidaTours',
        slug: 'know-more-with-altavidatours',
        description: 'Get comprehensive information about AltaVidaTours and travel services'
      }
    });

    console.log(`Updated ${updated.count} destination(s)`);
  } catch (error) {
    console.error('Error updating destination:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDestination();