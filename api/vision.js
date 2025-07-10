export default async function handler(req, res) {
  const { image } = req.body;
  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  const body = JSON.stringify({
    requests: [{
      image: { content: image },
      features: [{ type: "TEXT_DETECTION" }]
    }]
  });

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
