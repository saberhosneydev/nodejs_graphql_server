const faker = require("faker");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
    for (let index = 0; index < 5; index++) {
        await prisma.user.create({
            data: {
                name: faker.name.findName(),
                email: faker.internet.email(),
                password: faker.internet.password(8, true)
            }
        });
    }
}
main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })