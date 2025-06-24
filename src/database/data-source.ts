import * as dotenv from 'dotenv';
import configuration from '../config/typeorm/config';
dotenv.config();
import { DataSource } from 'typeorm';

const dbConfig = configuration().db;

export default new DataSource(dbConfig);
