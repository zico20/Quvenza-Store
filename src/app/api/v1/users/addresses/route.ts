import { NextRequest } from 'next/server';
import { getUserAddresses, addUserAddress } from '@/services/users/user.service';
import { addAddressSchema } from '@/schemas/user.schema';
import { requireAuth } from '@/lib/auth';
import { sendSuccess } from '@/lib/api-response';
import { handleApiError } from '@/lib/errors';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const addresses = await getUserAddresses(user.id);
    return sendSuccess({ addresses });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    const validated = addAddressSchema.parse(body);
    const address = await addUserAddress(user.id, validated);
    return sendSuccess({ address }, 'Address added', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
