export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data' });
    }

    const apiKey = process.env.GOOGLE_VISION_API_KEY;

    const body = JSON.stringify({
      requests: [{
        image: { content: image },
        features: [{ type: "TEXT_DETECTION" }]
      }]
    });

    const googleResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      }
    );

    const data = await googleResponse.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

