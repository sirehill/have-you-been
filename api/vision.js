export default async function handler(req, res) {
  console.log('🔍 Incoming request:', req.method);

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body || {};
    console.log('🖼️ Received image data?', !!image);

    if (!image) {
      console.log('❌ No image data received!');
      return res.status(400).json({ error: 'No image data' });
    }

    const apiKey = process.env.GOOGLE_VISION_API_KEY;
    console.log('🔑 Using API key:', apiKey ? 'Yes' : 'No');

    const body = JSON.stringify({
      requests: [{
        image: { content: image },
        features: [{ type: "TEXT_DETECTION" }]
      }]
    });

    console.log('➡️ Sending request to Google Vision API...');

    const googleResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      }
    );

    console.log('✅ Google Vision responded with status:', googleResponse.status);

    const data = await googleResponse.json();
    console.log('📄 Google Vision response body:', JSON.stringify(data, null, 2));

    return res.status(200).json(data);

  } catch (error) {
    console.error('🔥 Internal server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
