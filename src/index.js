const { createError } = require('micro');
const qs = require('query-string');

const doctype = `<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">`;

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const BORDER = 3;
const COLORS = {
  GREEN: '#2C882E',
  ORANGE: '#EF6C00',
  RED: '#DF332E',
  GREY: '#CCCCCC',
  TEXT: '#323A43',
};

function progress(value) {
  const progress = value / 100;
  const dashoffset = CIRCUMFERENCE * (1 - progress);

  return dashoffset;
}

module.exports = (req, res) => {
  const { url, query } = qs.parseUrl(req.url);
  const { perf = 0, pwa = 0, a11y = 0, bp = 0, seo = 0 } = query;

  // Only support requests to root.
  if (url !== '/') {
    throw createError(400, 'Bad Request');
  }

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public,s-maxage=3600');

  res.end(`${doctype}
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="888" height="${RADIUS *
      2 +
      BORDER * 2 +
      40}" viewBox="0 0 888 ${RADIUS * 2 + BORDER * 2 + 40}" fill="none" >
    ${getRingSvg(perf, 'Performance', 0)}
    ${getRingSvg(pwa, 'Progressive Web App', 1)}
    ${getRingSvg(a11y, 'Accessibility', 2)}
    ${getRingSvg(bp, 'Best Practices', 3)}
    ${getRingSvg(seo, 'SEO', 4)}
    </svg>`);
};

function getRingSvg(value, title, position) {
  const y = RADIUS + BORDER + 30 + position * RADIUS * 6.5;
  const x = RADIUS + BORDER;

  return `
<g>
<g transform="rotate(-90, ${RADIUS + BORDER}, ${RADIUS + BORDER})">
<circle fill="none" cx="${RADIUS + BORDER}" cy="${y}" r="${RADIUS}" stroke="${
    COLORS.GREY
  }" stroke-width="${BORDER}" />
<circle fill="none" cx="${RADIUS +
    BORDER}" cy="${y}" r="${RADIUS}" stroke="${getColor(
    value
  )}" stroke-linecap="round" stroke-width="${BORDER}"  stroke-dasharray="${CIRCUMFERENCE}"  stroke-dashoffset="${progress(
    value
  )}" />
<text transform="rotate(90, ${x}, ${y})" x="${x}" y="${y + 7}" fill="${getColor(
    value
  )}" text-anchor="middle" font-family="Roboto, sans-serif" font-size="20">${value}</text>
</g>
<text x="${y}" y="${RADIUS * 3 + BORDER}" fill="${
    COLORS.TEXT
  }" text-anchor="middle" font-family="Roboto, sans-serif">${title}</text>
</g>
`;
}

function getColor(value) {
  if (value < 40) {
    return COLORS.RED;
  } else if (value < 80) {
    return COLORS.ORANGE;
  } else {
    return COLORS.GREEN;
  }
}
