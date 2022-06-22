import { Pool } from "pg";

const pool = new Pool({
    host: "postgres",
    port: 5432,
    database: process.env.POSTGRES_DB_NAME,
    user: process.env.POSTGRES_FANCY_SPIRITS_USER,
    password: process.env.POSTGRES_FANCY_SPIRITS_PASSWORD
});

console.log(`Successfully logged into ${process.env.POSTGRES_DB_NAME} with the user: ${process.env.POSTGRES_FANCY_SPIRITS_USER}`);

export const querySingle = (text: string, params: Array<any>) => pool.query(text, params);

export const queryMultiple = async (queries: [text: string, params: Array<any>][]) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
    
        const results = await Promise.all(queries.map(async ([text, params]) => {
            return await client.query(text, params);
        }));

        await client.query("COMMIT");

        return results;
    } catch (e) {
        await client.query("ROLLBACK");
        throw e;
    } finally {
        client.release();
    }
}