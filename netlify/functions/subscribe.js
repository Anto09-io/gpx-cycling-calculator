exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let email;
  try {
    ({ email } = JSON.parse(event.body));
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Body JSON invalide' }) };
  }

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email manquant' }) };
  }

  const BEEHIIV_API_KEY = process.env.BEEHIIV_API_KEY;
  const BEEHIIV_PUB_ID = process.env.BEEHIIV_PUB_ID;

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUB_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: true,
          utm_source: 'calculateur-gpx',
          utm_medium: 'landing-page',
          automation_ids: [process.env.BEEHIIV_AUTOMATION_ID]
        })
      }
    );

    const data = await res.json().catch(() => ({}));

    if (res.ok || res.status === 201) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }

    console.error('Beehiiv error:', res.status, JSON.stringify(data));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur Beehiiv', status: res.status, detail: data })
    };
  } catch (e) {
    console.error('Fetch error:', e.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erreur réseau', detail: e.message })
    };
  }
};
