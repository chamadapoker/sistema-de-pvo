
import prisma from './config/database';

async function main() {
    try {
        const categoryCount = await prisma.category.count();
        console.log(`Categories count: ${categoryCount}`);

        const categories = await prisma.category.findMany();
        console.log('Categories:', JSON.stringify(categories, null, 2));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
