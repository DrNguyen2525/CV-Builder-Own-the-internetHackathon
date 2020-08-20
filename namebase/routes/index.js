const router = require('express').Router();

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
      err
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
    res.status(400).json({
      response
    });
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
    await getPdfFromPage(`${BASE_URL}/r/${id}`, type, `./uploads/SiabaseCV-${id}.pdf`);

    res.json({ message: 'Uploaded successfully.' });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
