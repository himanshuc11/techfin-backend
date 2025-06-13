import { db } from "#db/index.js";
import { Transactions } from "#db/schema/index.js";
import { faker } from "@faker-js/faker";

// 👇 this function inserts `count` dummy transactions
export async function insertDummyTransactions(count: number) {
  const dummyData = Array.from({ length: count }).map(() => ({
    payee: faker.company.name(),
    amountInPaise: faker.number.int({ min: 1000, max: 500000 }), // ₹10 to ₹5000
    category: faker.commerce.department(),
    date: faker.date
      .between({ from: "2023-01-01", to: "2025-01-01" })
      .toISOString(),
    isDeleted: false,
    organization: faker.number.int({ min: 1, max: 20 }),
  }));

  await db.insert(Transactions).values(dummyData);
  console.log(`✅ Inserted ${count} dummy transactions`);
}
