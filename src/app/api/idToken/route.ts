import { getAuth } from 'firebase-admin/auth';
import { type NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  idToken?: string;
}

export const POST = async (request: NextRequest): Promise<NextResponse> => {
  console.log('=========== POST /api/idToken ============');

  const reqBody: RequestBody = await request.json();
  if (typeof reqBody.idToken !== 'string') {
    console.error('idToken is invalid:', reqBody.idToken);
    console.log('=========== ============ ============');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await getAuth()
    .verifyIdToken(reqBody.idToken, true)
    .catch((error) => {
      console.error('idToken is invalid.');
      console.error(error);
      console.log('=========== ============ ============');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    });
  console.info('idToken is valid.');
  console.log('=========== ============ ============');
  return NextResponse.json({ status: 'ok' });
};
