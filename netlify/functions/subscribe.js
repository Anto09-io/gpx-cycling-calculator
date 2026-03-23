exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { email } = JSON.parse(event.body);

  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Email manquant' }) };
  }

  const res = await fetch(
    'https://api.beehiiv.com/v2/publications/pub_64b6d153-f6d6-4193-892a-64bf8d36c964/subscriptions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 9DHmh3y0353w3Bb1py8Gi6BE3cXM077GbIsV4IvUM16715ZkSJMO2bCMzADRAxRL'
      },
      body: JSON.stringify({
        email,
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'calculateur-gpx',
        utm_medium: 'landing-page'
      })
    }
  );

  if (res.ok || res.status === 201) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }

  return {
    statusCode: 500,
    body: JSON.stringify({ error: 'Erreur Beehiiv' })
  };
};
