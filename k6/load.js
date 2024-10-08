import http from 'k6/http';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';


export const options = {
  discardResponseBodies: true,
  scenarios: {
    success: {
      executor: 'constant-vus',
      exec: 'success',
      vus: 50,
      duration: '15m',
    },
    failor: {
      executor: 'constant-vus',
      exec: 'error',
      vus: 30,
      duration: '15m',
    },
    status: {
      executor: 'constant-vus',
      exec: 'status',
      vus: 40,
      duration: '15m',
    },
    differentPath: {
      executor: 'constant-vus',
      exec: 'differentPath',
      vus: 60,
      duration: '15m',
    },
    differentMethod: {
      executor: 'constant-vus',
      exec: 'differentMethod',
      vus: 10,
      duration: '15m',
    },
    breakingSlo: {
      executor: 'per-vu-iterations',
      exec: 'breakingSlo',
      vus: 50,
      iterations: 100,
      startTime: '2m',
      maxDuration: '1m',
    }
  },
};

const BASE_URL = 'http://127.0.0.1:8080'
export function success() {
  http.get(`${BASE_URL}/status/200`);
}

export function breakingSlo() {
  http.get(`${BASE_URL}/status/502`);
}

export function status() {
  http.get(`${BASE_URL}/status/200`);
  const expr = randomIntBetween(1, 20);
  if (expr == 1) {
    http.get(`${BASE_URL}/status/500`);
  }
  if (expr == 2 || expr == 3) {
    http.get(`${BASE_URL}/status/404`);
  }
}


export function error() {

  const expr = randomIntBetween(1, 10);
  switch (expr) {
    case 1:
      http.get(`${BASE_URL}/status/400`);
      break;
    case 2:
      http.get(`${BASE_URL}/status/404`);
    case 3:
      http.get(`${BASE_URL}/status/500`);
      break;
    case 4:
      http.get(`${BASE_URL}/status/502`);
      break;
    case 5:
      http.get(`${BASE_URL}/status/503`);
      break;
  }
  sleep(randomIntBetween(1, 5)); // sleep between 1 and 5 seconds.
}


export function differentPath() {

  const expr = randomIntBetween(1, 5);
  switch (expr) {
    case 1:
      http.get(`${BASE_URL}/cache`);
      break;
    case 2:
      http.get(`${BASE_URL}/ip`);
    case 3:
      http.get(`${BASE_URL}/headers`);
      break;
    case 4:
      http.get(`${BASE_URL}/user-agent`);
      break;
    case 5:
      http.get(`${BASE_URL}/image`);
      break;
  }

  const random = randomIntBetween(1, 7)
  if (random == 1) {
    http.get(`${BASE_URL}/status/500`);
    sleep(1); // sleep between 1
  }
}


export function differentMethod() {

  var payload;
  var params;

  payload = JSON.stringify({
    content: 'aaa',
  });

  params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const expr = randomIntBetween(1, 5);
  switch (expr) {
    case 1:
      http.post(`${BASE_URL}/post`, payload, params);
      break;
    case 2:
      http.patch(`${BASE_URL}/patch`, payload, params);
      break;
    case 3:
      http.del(`${BASE_URL}/delete`, payload, params);
      break;
    case 4:
      http.put(`${BASE_URL}/put`, payload, params);
      break;
    case 5:
      http.post(`${BASE_URL}/response-headers`, payload, params);
      break;
  }

}
