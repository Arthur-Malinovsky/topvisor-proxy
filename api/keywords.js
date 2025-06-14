const axios = require('axios');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { project_id } = req.body;

  if (!project_id) {
    return res.status(400).json({ error: 'project_id is required' });
  }

  const API_KEY = 'b9844255f0ee6864b807656bc21459fa';
  const USER_ID = '286988';

  const payload = {
    data: [
      {
        project_id: Number(project_id),
        keywords_ids: [],
        fields: ['keyword', 'last_position']
      }
    ]
  };

  try {
    const response = await axios.post('https://api.topvisor.com/v2/json/get/keywords_2/keywords', payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'User-Id': USER_ID,
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;

    if (!result.result || !result.result[0] || !result.result[0].keywords) {
      return res.status(500).json({ error: 'Invalid response from Topvisor API' });
    }

    const keywords = result.result[0].keywords.map(item => ({
      keyword: item.keyword || '—',
      last_position: Number(item.last_position) || 0
    }));

    res.status(200).json({ result: keywords });
  } catch (err) {
    console.error('Topvisor error:', err.message);
    res.status(500).json({ error: 'Failed to fetch from Topvisor' });
  }
}
