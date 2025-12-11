// scripts/updateDubaiDestination.ts
import prisma from './prisma.js';

async function updateDubaiDestination() {
  try {
    const updated = await prisma.destination.update({
      where: {
        slug: 'know-more-with-memphis'
      },
      data: {
        name: 'Know more with AltaVidaTours - Dubai',
        slug: 'know-more-with-altavidatours-dubai',
        description: 'Get comprehensive information about AltaVidaTours Dubai tours and travel services'
      }
    });

    console.log(`Updated destination: ${updated.name}`);
  } catch (error) {
    console.error('Error updating destination:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateDubaiDestination();
