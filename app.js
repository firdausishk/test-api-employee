// app.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 9999;

app.use(bodyParser.json());

// movies
app.post('/movies', async (req, res) => {
  const { title, description, rating, image } = req.body;
  try {
    const result = await db.query('INSERT INTO movies (title, description, rating, image) VALUES ($1, $2, $3, $4 ) RETURNING *', [title, description, rating, image]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error create movies' });
  }
});

// Read All
app.get('/movies', async (req, res) => {
    try {   
      const result = await db.query('SELECT * FROM movies');

      if (result.rows.length === 0) {
        res.json([])
      } else {
        res.json(result.rows);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error get movies' });
    }
  });

// Read
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM movies WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Movies not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error Get Movies' });
  }
});

// Update
app.patch('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, rating, image } = req.body;

  const updateTimestampe = new Date()
  
  try {
    const result = await db.query('UPDATE movies SET title = $1, description = $2, rating = $3, image = $4, updated_at = $5 WHERE id = $6 RETURNING *', 
    [title, description, rating, image,updateTimestampe, id]);
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'movies not found' });
    } else {
      res.json(result.rows[0]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error update movies' });
  }
});

// Delete
app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM movies WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'movie not found' });
    } else {
      res.json({ message: 'Movie deleted successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error delete movie' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
