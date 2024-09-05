// src/routes/api/update/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

// POST���N�G�X�g�̏���
export const POST: RequestHandler = async ({ request }) => {
  try {
    // ���N�G�X�g����JSON�f�[�^���擾
    const data = await request.json();
    const value = data.value;

    if (typeof value !== 'string') {
      return {
        status: 400,
        body: { error: 'Invalid value' }
      };
    }

    // �R���\�[���Ƀf�[�^���o��
    console.log('Received value:', value);

    // �K�v�ɉ����āA�����Ńf�[�^�x�[�X�ɕۑ�����Ȃǂ̏�����ǉ��ł��܂�

    // �����̃��X�|���X��Ԃ�
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
