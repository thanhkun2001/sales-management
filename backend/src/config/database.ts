import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { Product } from "../entities/Product";
import { Order } from "../entities/Order";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource(
  isProduction
    ? {
        type: "postgres",
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        synchronize: true,
        logging: false,
        entities: [User, Product, Order],
      }
    : {
        type: "postgres",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        synchronize: true,
        logging: false,
        entities: [User, Product, Order],
      }
);