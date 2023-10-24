import request from '@/utils/request/index';

interface Test {
  data: Record<string, any>
}

export function testApi() {
  return request.get<Result<Test>>({
    url: '/getRouters',
    method: 'get',
    data: { aa: 2 },
    params: {aa: 1}
  }, { aa: '3242'});
}
