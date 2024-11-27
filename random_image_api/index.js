const express = require("express");
const axios = require("axios");

const app = express();

app.get("/api/image/random",async(req,res)=>{
    try {
        const randomImageUrl = `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 1000)}`;
        
        res.json({
            success: true,
            imageUrl: randomImageUrl,
        });
        
        console.log(`Random image URL generated: ${randomImageUrl}`);
    } catch (error) {
        console.error("Error generating random image:", error.message);
        res.status(500).json({ success: false, error: "Failed to generate random image." });
    }
})

app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000");
})