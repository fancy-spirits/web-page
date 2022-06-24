import { Pool, QueryResult } from "pg";

export class DB {
    private static _db: DB;
    
    private pool: Pool;

    private constructor(){
        this.pool = new Pool({
            host: "postgres",
            port: 5432,
            database: process.env.POSTGRES_DB_NAME,
            user: process.env.POSTGRES_FANCY_SPIRITS_USER,
            password: process.env.POSTGRES_FANCY_SPIRITS_PASSWORD
        });
    }

    public static getInstance() {
        if (!DB._db) {
            DB._db = new DB();
        }
        return DB._db;
    }

    async printPrivileges(){
        const query = `SELECT * FROM information_schema.role_table_grants;`
        const result = await this.querySingle(query, []);
        console.info("⏱ Current privileges: ", ...result.rows);
    }
    
    querySingle = async (text: string, params: Array<any>) => {
        const client = await this.pool.connect();
        try {
            console.info(`⏱ Performing SQL query '${text}' with arguments ${truncParams(params)}`);
            const result = await client.query(text, params);
            console.info(`✅ Query '${text}' finished successfully`);
            return result;
        } catch (exception) {
            console.error(`⭕️ SQL-Query '${text}' with arguments ${truncParams(params)} failed: `, exception);
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
    
    queryMultiple = async (queries: [text: string, params: Array<any>][]) => {
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
        
            const results = await Promise.all(queries.map(async ([text, params]) => {
                try {
                    console.info(`⏱ Performing SQL query '${text}' with arguments ${truncParams(params)}`);
                    const result = await client.query(text, params);
                    console.info(`✅ Query '${text}' finished successfully`);
                    return result;
                } catch (exception) {
                    console.error(`⭕️ SQL-Query '${text}' with arguments ${truncParams(params)} failed: `, exception);
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
}

function truncParams(params: any[]) {
    return params.map(param => param.toString().length > 20 ? `${param.toString().substring(0, 20)}...`: param);
}