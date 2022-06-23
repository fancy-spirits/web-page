import { Pool, QueryResult } from "pg";
import { createGenre } from "./dbHandles/insertDB";

let pool: Pool;
export default function db() {
    if (!pool) {
        pool = new Pool({
            host: "postgres",
            port: 5432,
            database: process.env.POSTGRES_DB_NAME,
            user: process.env.POSTGRES_FANCY_SPIRITS_USER,
            password: process.env.POSTGRES_FANCY_SPIRITS_PASSWORD
        });

        console.log(`Successfully logged into ${process.env.POSTGRES_DB_NAME} with the user: ${process.env.POSTGRES_FANCY_SPIRITS_USER}`);

        printPrivileges();
        createGenre({
            name: "Drum & Bass"
        });
    }
    return {
        querySingle,
        queryMultiple
    }
}

async function printPrivileges(){
    const query = `SELECT * FROM information_schema.role_table_grants;`
    const result = await querySingle(query, []);
    console.info("⏱ Current privileges: ", ...result.rows);
}

const querySingle = async (text: string, params: Array<any>) => {
    const client = await pool.connect();
    try {
        console.info(`⏱ Performing SQL query '${text}' with arguments ${params}`);
        const result = await client.query(text, params);
        console.info(`✅ Query '${text}' finished successfully`);
        return result;
    } catch (exception) {
        console.error(`⭕️ SQL-Query '${text}' with arguments ${params} failed: `, exception);
        return {
          rows: [],
          rowCount: 0,
          command: "",
          fields: [],
          oid: -1
        } as QueryResult;
    } finally {
        client.release();
    }
};

const queryMultiple = async (queries: [text: string, params: Array<any>][]) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
    
        const results = await Promise.all(queries.map(async ([text, params]) => {
            try {
                console.info(`⏱ Performing SQL query '${text}' with arguments ${params}`);
                const result = await client.query(text, params);
                console.info(`✅ Query '${text}' finished successfully`);
                return result;
            } catch (exception) {
                console.error(`⭕️ SQL-Query '${text}' with arguments ${params} failed: `, exception);
                throw exception;
            }
        }));

        await client.query("COMMIT");
        console.info(`✅ ✅ Transaction finished successfully`);

        return results;
    } catch (e) {
        console.error(`⭕️ SQL-Transaction consisting of: ${queries.map(query => `${query[0]}(${query[1]}), `)}`);
        console.error("⭕️ failed", e);
        await client.query("ROLLBACK");
        return [];
    } finally {
        client.release();
    }
}