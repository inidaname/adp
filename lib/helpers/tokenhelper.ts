import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({path: '.env'})

export async function createToken(data: any): Promise<string>{
    const token = await jwt.sign(data, process.env.secret);
    
    return token;
}