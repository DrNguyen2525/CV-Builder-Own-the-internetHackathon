const router = require('express').Router();
const multer = require('multer');
const fs = require('fs');
var skynet = require('@nebulous/skynet');

const upload = multer({ dest: 'uploads/' });

const { api, getPdfFromPage } = require('../helper');

const environment = process.env.NODE_ENV || 'development';

const BASE_URL =
  environment === 'development' ? 'http://localhost:8000' : 'https://siabase-cv.web.app';

router.get('/connecting', async (req, res) => {
  try {
    const response = await api('GET', '/api/v0/dns/domains/dkoi', null);
    res.status(200).json({
      response
    });
  } catch (error) {
    res.status(400).json({
      error
    });
  }
});

router.post('/upload', async (req, res) => {
  try {
    const skylink = req.body.skylink;
    console.log(skylink);
    var body = `{"records": [{ "type": "TXT", "host": "", "value":"${skylink}","ttl": 0 }] }`;
    const response = await api('PUT', '/api/v0/dns/domains/dkoi', body);
    res.status(200).json({
      response
    });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Upload avatar
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    // MULTER process and assign FILE object to req
    const processedFile = req.file || {};

    // Uploaded file's original name
    let orgName = processedFile.originalname || '';
    orgName = orgName.trim().replace(/ /g, '-');

    // Full path of uploaded file on server
    const fullPathInServer = processedFile.path;

    // Add orignal file extension, as multer name the file without extension by default
    const newFullPath = `${fullPathInServer}.${orgName.split('.').slice(1).pop() || ''}`;

    fs.renameSync(fullPathInServer, newFullPath);

    let skylink = await skynet.uploadFile(`./${newFullPath}`);

    fs.unlink(`./${newFullPath}`, error => {
      if (error) throw error;
    });

    skylink = skylink.toString().slice(6);

    res.json({
      status: true,
      message: 'Photo uploaded successfully.',
      skylink
    });
  } catch (error) {
    if (error) throw error;

    res.status(500).json(error);
  }
});

router.post('/exportPdf', async (req, res) => {
  const { id, type } = req.body;

  if (!id)
    return res.status(400).json({
      error: 'Invalid argument: The API must be called with argument "id" containing the resume ID.'
    });

  if (!type)
    return res.status(400).json({
      error:
        'Invalid argument: The function must be called with argument "type" containing the type of resume.'
    });

  try {
    const pdf = await getPdfFromPage(`${BASE_URL}/r/${id}`, type);

    res.json({ b64EncodedData: Buffer.from(pdf).toString('base64') });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/uploadToSkynet', async (req, res) => {
  const { id, type } = req.body;

  if (!id)
    return res.status(400).json({
      error: 'Invalid argument: The API must be called with argument "id" containing the resume ID.'
    });

  if (!type)
    return res.status(400).json({
      error:
        'Invalid argument: The function must be called with argument "type" containing the type of resume.'
    });

  try {
    // File location on server
    const path = `./uploads/SiabaseCV-${id}.pdf`;

    await getPdfFromPage(`${BASE_URL}/r/${id}`, type, path);

    let skylink = await skynet.uploadFile(path);

    fs.unlink(path, error => {
      if (error) throw error;
    });

    skylink = skylink.toString().slice(6);

    res.json({
      status: true,
      message: 'Resume uploaded successfully.',
      skylink
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
