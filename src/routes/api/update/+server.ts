// src/routes/api/update/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

// POSTリクエストの処理
export const POST: RequestHandler = async ({ request }) => {
  try {
    // リクエストからJSONデータを取得
    const data = await request.json();
    const value = data.value;

    if (typeof value !== 'string') {
      return {
        status: 400,
        body: { error: 'Invalid value' }
      };
    }

    // コンソールにデータを出力
    console.log('Received value:', value);

    // 必要に応じて、ここでデータベースに保存するなどの処理を追加できます

    // 成功のレスポンスを返す
    return {
      status: 200,
      body: { message: 'Value updated successfully' }
    };
  } catch (error) {
    console.error('Error handling /api/update request:', error);
    return {
      status: 500,
      body: { error: 'Internal Server Error' }
    };
  }
};
