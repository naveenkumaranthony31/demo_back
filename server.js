const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors");
const app = express();
const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;

const URL ="mongodb+srv://naveenthiwary20:HG1UPEthVMlP1u2W@ticket.aw6qj.mongodb.net/";
const DB = "Demo_project";

app.use(express.json());
app.use(
  cors({
    origin: "*", // Remove trailing slash
  })
);

// POST: Create a new user
app.post("/userspost", async (request, response) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);

    await db.collection("Users").insertOne(request.body);

    await connection.close();
    response.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    console.error("Error in POST /userspost:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// find one user
app.post("/login", async (req, res) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);

    // Search for the user by email and password
    const user = await db.collection("Users").findOne({
      email: req.body.email,
      password: req.body.password,
    });

    await connection.close();

    if (user) {
      res.status(200).json({ message: "Login successful", user });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in POST /login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET: Fetch all users
app.get("/users", async (request, response) => {
  try {
    const connection = await mongoClient.connect(URL);
    const db = connection.db(DB);

    const users = await db.collection("Users").find().toArray();

    await connection.close();
    response.status(200).json(users);
  } catch (error) {
    console.error("Error in GET /users:", error);
    response.status(500).json({ message: "Internal Server Error" });
  }
});

// // GET: Fetch a single user by ID
// app.get("/users/:id", async (request, response) => {
//   try {
//     const connection = await mongoClient.connect(URL);
//     const db = connection.db(DB);

//     const user = await db.collection("Users").findOne({ _id: new ObjectId(request.params.id) });

//     await connection.close();

//     if (!user) {
//       return response.status(404).json({ message: "User not found" });
//     }

//     response.status(200).json(user);
//   } catch (error) {
//     console.error("Error in GET /users/:id:", error);
//     response.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // PUT: Update a user by ID
// app.put("/users/:id", async (request, response) => {
//   try {
//     const connection = await mongoClient.connect(URL);
//     const db = connection.db(DB);

//     const result = await db.collection("Users").updateOne(
//       { _id: new ObjectId(request.params.id) },
//       { $set: request.body }
//     );

//     await connection.close();

//     if (result.matchedCount === 0) {
//       return response.status(404).json({ message: "User not found" });
//     }

//     response.status(200).json({ message: "User updated successfully!" });
//   } catch (error) {
//     console.error("Error in PUT /users/:id:", error);
//     response.status(500).json({ message: "Internal Server Error" });
//   }
// });

// // DELETE: Remove a user by ID
// app.delete("/users/:id", async (request, response) => {
//   try {
//     const connection = await mongoClient.connect(URL);
//     const db = connection.db(DB);

//     const result = await db.collection("Users").deleteOne({ _id: new ObjectId(request.params.id) });

//     await connection.close();

//     if (result.deletedCount === 0) {
//       return response.status(404).json({ message: "User not found" });
//     }

//     response.status(200).json({ message: "User deleted successfully!" });
//   } catch (error) {
//     console.error("Error in DELETE /users/:id:", error);
//     response.status(500).json({ message: "Internal Server Error" });
//   }
// });

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
