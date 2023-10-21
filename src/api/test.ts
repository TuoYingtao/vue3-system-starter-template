import { request } from '@/utils/request/index';

interface Test {
  data: Record<string, any>
}

export function testApi() {
  return request.post<Result<Test>>({
    url: '/getRouters/401',
    method: 'get',
    data: { aa: 2 },
    params: {aa: 1}
  });
}
