const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) {
      return res.status(403).send({ auth: false, message: 'No token provided.' });
  }
    const bearerToken = bearerHeader.split(" ")[1];
    jwt.verify(bearerToken, 'my_key', (err, data) => {
      if (err) {
        return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      } 
    })
    req.token = bearerToken
    next();
  }

app.post('/api/login', (req, res) => {
  const user = {
    userName : req.body.userName,
    password : req.body.password,
  }
  const token = jwt.sign({ user }, 'my_key')
  res.json({
    token,
  })
})

app.get('/api', (req, res) => {
  res.json({
    text: 'my api'
  })
})

app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    text: 'you got access'
  })
})
app.listen(3000, () => {
  console.log('listening on port 3000');
})
