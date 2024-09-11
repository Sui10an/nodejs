// src/routes/api/update/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

// POST���N�G�X�g�̏���
export const POST: RequestHandler = async ({ request }) => {
  try {
    // ���N�G�X�g����JSON�f�[�^���擾
    const data = await request.json();
    const value = data.value;

    if (typeof value !== 'string') {
      return new Response(JSON.stringify({
        status: 400,
        body: { error: 'Invalid value' }
      }));
    }

    if (value == "countup") {
      return new Response(JSON.stringify({
        status: 200,
        body: {message: "countup"}
      }))
    }

    // �R���\�[���Ƀf�[�^���o��
    console.log('[/api/update] Received value:', value);

    // �K�v�ɉ����āA�����Ńf�[�^�x�[�X�ɕۑ�����Ȃǂ̏�����ǉ��ł��܂�

    // �����̃��X�|���X��Ԃ�
    return new Response(JSON.stringify({
      status: 200,
      body: { message: 'Value updated successfully' }
    }));
  } catch (error) {
    console.error('Error handling /api/update request:', error);
    return new Response(JSON.stringify({
      status: 500,
      body: { error: 'Internal Server Error' }
    }));
  }
};
