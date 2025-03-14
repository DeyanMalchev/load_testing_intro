import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    scenarios: {
        // Shared iterations scenario
        constant_load: {
            executor: 'shared-iterations',
            vus: 10,
            iterations: 100,
            startTime: '0s',
        },
        // Per VU iterations scenario
        peak_load: {
            executor: 'per-vu-iterations',
            vus: 20,
            iterations: 10,
            startTime: '15s',
        },
    },
};

export default function () {
    const url = 'http://localhost:8080/capitalize';
    const payload = JSON.stringify({
        name: 'john doe',
        email: 'john.doe@example.com',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    let res = http.post(url, payload, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response body has capitalized name': (r) => JSON.parse(r.body).name === 'JOHN DOE',
        'response body has capitalized email': (r) => JSON.parse(r.body).email === 'JOHN.DOE@EXAMPLE.COM',
    });

    sleep(1);
}