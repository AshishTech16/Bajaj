const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();


app.use(bodyParser.json());
app.use(cors()); 

app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    console.log('Request Body:', req.body);

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data format. Data must be an array.' });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const highestLowercase = alphabets.filter(char => char === char.toLowerCase())
                                       .sort().pop() || null;

    let fileValid = false, fileMimeType = '', fileSizeKB = 0;
    if (file_b64) {
        try {
            const buffer = Buffer.from(file_b64, 'base64');
            fileSizeKB = buffer.length / 1024; 
            fileMimeType = 'application/octet-stream'; 
            fileValid = true;
        } catch (error) {
            fileValid = false;
        }
    }
    res.json({
        is_success: true,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKB
    });
});

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

app.listen(3002, () => {
    console.log('Backend running on port 3002');
});
