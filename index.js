const express = require('express');

const app = express();
// Replace with your Public API Key.
const apiKey = 7387e6ebbf104f7485033888eb607736;
const port = 3000;

const handleError = err => {
  // The requested Builder content could not be found.
  if (err.response.status === 404) {
    return { data: null };
  }
  throw err;
};

// Catchall route
app.get('*', async (req, res) => {
  const encodedUrl = encodeURIComponent(req.url);
  const { data: pageData } =
    await fetch(`https://cdn.builder.io/api/v1/html/page?apiKey=${apiKey}&url=${encodedUrl}`)
      .then((res) => res.json())
      .catch(handleError);

  if (pageData) {
    const pageHtml = pageData.html;

    res.send(`
      <html>
        <head> <!-- Your head content here --> </head>
        <body>
           ${pageHtml}
        </body>
      </html>
    `);
  } else {
    res.status(404);
    res.send(/* Your 404 page HTML */);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
import { builder } from '@builder.io/sdk'

builder.init('7387e6ebbf104f7485033888eb607736')
builder.apiVersion = 'v3'

builder.get('page').promise().then(content => {
  // Add the HTML to the element needed, wrapping with our webcomponent library
  // to fill in any needed interactivity (e.g. lazy loaded images, interactive tabs, etc)
  document.querySelector('#my-page').innerHTML = `
    <builder-component model="page">\${content.data.html}</builder-component>
    <script async src="https://cdn.builder.io/js/webcomponents"></script>
  `
});
