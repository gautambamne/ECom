import app from "./app";
import { connectDb } from "./db/connectDb";
import {redisClient} from "./db/redis.connection"
import "dotenv/config";

const PORT = process.env.PORT || 5000;

app.get('/health', (req, res)=>{
    res.json({
        message: "Server is healthy"
    })
})

connectDb()
.then(async ()=>{
    await redisClient.connect()
    app.listen(PORT, ()=>{
        console.log(`Server is running on port http://localhost:${PORT}`);
    })
}).catch((error)=>{
    console.error("Failed to connect to the database. Server not started.", error);
});