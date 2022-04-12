require('dotenv').config();
import express from 'express';
import API from '../data/BackendAPI';

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers'
  );
  next();
});

// GET
app.get('/', (req, res) => {
  res.status(200).send('hi');
});

app.get('/hot', (req, res) => {
  API.getHotQuestions()
    .then((posts) => {
      res.status(200).send(posts);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/search/:searchScope/:searchQuery', (req, res) => {
  const scope = JSON.parse(req.params.searchScope);
  API.Search.search(req.params.searchQuery, scope)
    .then((searchResults) => {
      res.status(200).send(searchResults);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/q/:qid', (req, res) => {
  API.Questions.getQuestionPost(req.params.qid)
    .then((questionPost) => {
      res.status(200).send(questionPost);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/votes/:answerID/:voter_uid', (req, res) => {
  API.Answers.checkIfVoted(req.params.answerID, req.params.voter_uid)
    .then((response) => {
      res.status(200).send(response.toString());
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/karma/:answerID', (req, res) => {
  API.Answers.getKarmaCount(req.params.answerID)
    .then((count) => {
      res.status(200).send(count.toString());
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/spellcheck/:string', (req, res) => {
  API.getSpellingSuggestions(req.params.string).then((corrections) => {
    res.status(200).send(corrections);
  });
});

// POST
app.post('/upvote', (req, res) => {
  API.Answers.upvote(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
