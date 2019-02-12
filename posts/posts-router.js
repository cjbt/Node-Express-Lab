const express = require('express');
const db = require('../data/db');
const router = express.Router();

router.post('/', (req, res) => {
  const posts = req.body;
  db.insert(posts)
    .then(post => {
      if (!post) {
        res.status(500).json({
          error: 'There was an error while saving the post to the database'
        });
      } else {
        res.status(201).json(post);
      }
    })
    .catch(() => {
      res.status(400).json({
        errorMessage: 'Please provide title and contents for the post.'
      });
    });
});

router.get('/', (req, res) => {
  db.find()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: 'The posts infomation could not be retrieved.' });
    });
});

router.get('/:id', (req, res) => {
  const postId = req.params.id;

  db.findById(postId)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    });
});

router.delete('/:id', (req, res) => {
  const postId = req.params.id;

  db.findById(postId)
    .then(post => {
      db.remove(postId)
        .then(() => {
          res.status(200).json(post);
        })
        .catch(() => {
          res.status(500).json({ error: 'The post could not be removed' });
        });
    })
    .catch(() => {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    });
});

router.put('/:id', (req, res) => {
  const postId = req.params.id;

  db.findById(postId)
    .then(() => {
      db.update()
        .then(post => {
          res.status(200).json(post);
        })
        .catch(() => {
          res.status(500).json({ error: 'The post could not be removed' });
        });
    })
    .catch(() => {
      res
        .status(404)
        .json({ message: 'The post with the specified ID does not exist.' });
    });
});

module.exports = router;
