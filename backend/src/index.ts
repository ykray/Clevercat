require('dotenv').config();
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import { Strategy } from 'passport-local';

// Data
import pool from './Pool';
import API from '../data/BackendAPI';
import chalk from 'chalk';
import log from '../utils/Logger';

const app = express();
const port = process.env.PORT;
const { requiresLogin } = require('../middleware/authorization');

const PostgresStore = require('connect-pg-simple')(session);
const sessionOptions = {
  store: new PostgresStore({
    pool,
    createTableIfMissing: true, // for "session" table
  }),
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 14 * 24 * 60 * 60 * 1000,
    secure: false,
  },
};

// Configure passport
passport.use(
  new Strategy((username, password, done) => {
    const query = {
      text: `--sql
          SELECT u.uid, u.username, u.password
          FROM users u
          WHERE u.username = $1 AND u.password = $2
      `,
      values: [username, password],
    };

    pool
      .query(query)
      .then((res) => {
        if (res.rows.length > 0) {
          const user = res.rows[0];
          // TODO: - Handle password match
          console.log(chalk.blueBright.bold('NEW'), chalk.bold('login'), user);
          done(null, user);
        } else {
          log.error('issue');
          done(null, false);
        }
      })
      .catch((error) => {
        log.error(error);
        done(error);
      });
  })
);

passport.serializeUser((user: any, done) => {
  console.log(chalk.bold('Serializing user:'), chalk.greenBright(user.uid));
  done(null, user.uid);
});

passport.deserializeUser((id, done) => {
  console.log(chalk.bold('Deserializing user:'), chalk.greenBright(id));

  API.Users.getUser(String(id))
    .then((user: any) => {
      done(null, user.uid);
    })
    .catch((error) => {
      done(error, null);
    });
});

// Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, authorization'
  );
  next();
});
app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE'],
    credentials: true,
    origin: process.env.ORIGIN,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  res.status(200).send('hi');
});
app.post('/auth/signup', API.Auth.signup);
app.post('/auth/login', passport.authenticate('local'), API.Auth.login);
app.delete('/auth/logout', API.Auth.logout);
app.get('/auth/current-user', API.Auth.currentUser);

// Users Routes
app.get('/karma/:uid', API.Users.getUserKarma);
app.get('/available/:username', API.Users.isUsernameAvailable);
app.get('/usernames/:username', (req, res) => {
  API.Users.getUserFromUsername(req.params.username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

app.get('/u/:uid', (req, res) => {
  API.Users.getUser(req.params.uid)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.get('/u/:uid/questions', API.Users.getUserQuestions);
app.get('/u/:uid/answers', API.Users.getUserAnswers);
app.post('/updateBio', API.Users.updateBio);
app.post('/ask', API.Users.askQuestion);

// Search Routes
app.get('/search/:searchScope/:searchQuery', (req, res) => {
  API.Search.search(req.params.searchQuery, req.params.searchScope)
    .then((searchResults) => {
      res.status(200).send(searchResults);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Questions Routes
app.get('/q/:qid', (req, res) => {
  API.Questions.getQuestionPost(req.params.qid)
    .then((questionPost) => {
      res.status(200).send(questionPost);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Answers Routes
app.get('/votes/:answerID/:voter_uid', (req, res) => {
  API.Answers.checkIfVoted(req.params.answerID, req.params.voter_uid)
    .then((response) => {
      res.status(200).send(response.toString());
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.post('/post-answer', requiresLogin, API.Answers.post);
app.post('/select-best-answer', requiresLogin, API.Answers.selectBestAnswer);

app.get('/karma/:answerID', (req, res) => {
  API.Answers.getKarmaCount(req.params.answerID)
    .then((count) => {
      res.status(200).send(count.toString());
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
app.post('/vote', (req, res) => {
  API.Answers.vote(req.body)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// Other Routes
app.get('/topics/:topicPath', API.getTopicFeed);
app.get('/all-topics', API.getAllTopics);
app.get('/hot', API.getHotQuestions);
app.get('/spellcheck/:string', (req, res) => {
  API.getSpellingSuggestions(req.params.string).then((corrections) => {
    res.status(200).send(corrections);
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
