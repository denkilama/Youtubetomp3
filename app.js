const express = require('express');
const ytdl = require('ytdl-core');
const app = express();

const port = 3000;

app.get('/download', async (req, res) => {
  const videoURL = req.query.url;
  try {
    const info = await ytdl.getInfo(videoURL);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    if (!audioFormats.length) {
      return res.status(400).json({ error: 'No audio formats available for this video.' });
    }

    const audioURL = audioFormats[0].url;
    res.header('Content-Disposition', `attachment; filename="${info.title}.mp3"`);
    ytdl(audioURL, { filter: 'audioonly' }).pipe(res);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during the download process.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
