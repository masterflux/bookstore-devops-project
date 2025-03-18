import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '1m', target: 500 },       
        { duration: '2m', target: 500 },
        { duration: '1m', target: 0 },
    ],
  };
  
export default function () {
  let res = http.get('http://131.145.91.125');
 // let res = http.get('http://131.145.8.161/catalog/science?_rsc=zs6pb');
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(1);
}
