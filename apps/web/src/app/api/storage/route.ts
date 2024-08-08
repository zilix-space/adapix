import { modules } from '@app/modules/src'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const form = await request.formData()

  const file = form.get('file')

  if (!file) {
    return NextResponse.json(
      { ok: true },
      {
        status: 404,
      },
    )
  }

  const url = await modules.provider.storage.upload(file as File)

  return NextResponse.json(
    {
      url,
    },
    {
      status: 201,
    },
  )
}
