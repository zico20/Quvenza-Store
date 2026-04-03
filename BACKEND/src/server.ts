import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';

async function main() {
  await prisma.$connect();
  console.log('Database connected.');
  app.listen(config.PORT, () => {
    console.log(`Server on port ${config.PORT} [${config.NODE_ENV}]`);
  });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
