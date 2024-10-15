import express from 'express';
import mysql from 'mysql';
import cors from 'cors';

const app=express();
const PORT=5000;

app.use(cors())
app.use(express.json())

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"products",
    port:'3309'
});

db.connect((err)=>{
    if (err) throw err;
    console.log("Connected to MYSQL Database");
});

app.get('/api/products', (req, res) => {
    const { cursor } = req.query; 
    const limit = 3; 

    let sqlQuery = 'SELECT * FROM Products ';
    let queryParams = [];

    // Validate cursor: check if it is a valid number
    if (cursor && !isNaN(cursor)) {
        sqlQuery += 'WHERE id > ? ';
        queryParams.push(Number(cursor)); // Convert to number
    }

    sqlQuery += 'ORDER BY id ASC LIMIT ?';
    queryParams.push(limit);

    console.log("SQL Query:", sqlQuery); 
    console.log("Query Params:", queryParams); 

    db.query(sqlQuery, queryParams, (err, results) => {
        if (err) {
            console.error("Database query error:", err); 
            return res.status(500).send('Error fetching data'); 
        }

        const nextCursor = results.length ? results[results.length - 1].id : null;
        res.json({ products: results, nextCursor });
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});