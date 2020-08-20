var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var cors = require('cors');
var fs = require('fs');
var app = express();

// handshake login
var route = require('./routes');

// set up cors to allow us to accept requests from our client
app.use(cors());

app.use(
  require('express-session')({
    secret: 'keybroad cat',
    resave: false,
    saveUninitialized: false
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cookieParser());

// Route
app.use('/', route);

// Upload avatar
app.post('/avatar', upload.single('avatar'), (req, res) => {
  const processedFile = req.file || {}; // MULTER xử lý và gắn đối tượng FILE vào req
  let orgName = processedFile.originalname || ''; // Tên gốc trong máy tính của người upload
  orgName = orgName.trim().replace(/ /g, '-');
  const fullPathInServ = processedFile.path; // Đường dẫn đầy đủ của file vừa đc upload lên server
  // Đổi tên của file vừa upload lên, vì multer đang đặt default ko có đuôi file
  const newFullPath = `${fullPathInServ}-${orgName}`;
  fs.renameSync(fullPathInServ, newFullPath);
  res.send({
    status: true,
    message: 'file uploaded',
    fileNameInServer: newFullPath
  });
});

app.listen(4000, err => {
  console.log('Server is listening at port 4000.');
});

module.exports = app;
