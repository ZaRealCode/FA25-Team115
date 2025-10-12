import { pgTable, integer, varchar, boolean, timestamp, text, serial, numeric } from "drizzle-orm/pg-core";

// Users table
export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  bio: text("bio"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
