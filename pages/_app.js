// _app.js

import Layout from "../components/layout/Layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

function calculateOverallRating(metric) {
  if (!metric || typeof metric !== 'object' || !metric.name || !metric.value) {
    return 'unknown';
  }

  const { name, value } = metric;

  if (name === 'LCP') {
    if (value < 2500) {
      return 'good';
    } else if (value < 4500) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  } else if (name === 'FID') {
    if (value < 100) {
      return 'good';
    } else if (value < 300) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  } else if (name === 'CLS') {
    if (value < 0.1) {
      return 'good';
    } else if (value < 0.25) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  } else if (name === 'FCP') {
    if (value < 500) {
      return 'good';
    } else if (value < 1000) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  } else if (name === 'TTFB') {
    if (value < 200) {
      return 'good';
    } else if (value < 600) {
      return 'needs-improvement';
    } else {
      return 'poor';
    }
  }

  // Return a default value if the metric name is not recognized
  return 'unknown';
}

export function reportWebVitals(metric) {
  const extendedMetric = {
    ...metric,
    deviceType: getDeviceType(), // Add device type
    path: window.location.pathname, // Add path
    overallRating: calculateOverallRating(metric), // Add overall rating
  };

  const body = JSON.stringify(extendedMetric);
  console.log(extendedMetric);
  const url = 'http://localhost:3009/metrics';

  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

function getDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.includes('mobile')) {
    return 'mobile';
  } else if (userAgent.includes('tablet')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

export default MyApp;
