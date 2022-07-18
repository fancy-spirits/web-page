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

    async querySingleTyped<T>(text: string, params: Array<any>): Promise<T[]> {
        const client = await this.pool.connect();
        try {
            console.info(`⏱ Performing SQL query '${text}' with arguments ${truncParams(params)}`);
            const result = await client.query(text, params);
            console.info(`✅ Query '${text}' finished successfully`);
            if (result.rowCount < 1) {
                return [];
            }
            return result.rows as T[];
        } catch (exception) {
            console.error(`⭕️ SQL-Query '${text}' with arguments ${truncParams(params)} failed: `, exception);
            return [];
        } finally {
            client.release();
        }
    } 
    
    /**
     * @deprecated Use Typed variant instead
     */
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
    
    /**
     * @deprecated
     */
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

    async startTransaction() {
        await this.pool.query("BEGIN");
    }
    
    async endTransaction() {
        await this.pool.query("COMMIT");
    }
    
    async rollback() {
        await this.pool.query("ROLLBACK");
    }
}

function truncParams(params: any[]) {
    return params.map(param => `${param}`.length > 40 ? `${`${param}`.substring(0, 20)}...`: param);
}