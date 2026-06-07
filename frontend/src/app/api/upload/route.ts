// Arc Network — /api/upload
// Uploads token logo to Pinata IPFS and returns the gateway URL.
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Forward to Pinata
    const pinataForm = new FormData()
    pinataForm.append('file', file)
    pinataForm.append(
      'pinataMetadata',
      JSON.stringify({ name: `token-logo-${Date.now()}` })
    )

    const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key:        process.env.PINATA_API_KEY!,
        pinata_secret_api_key: process.env.PINATA_API_SECRET!,
      },
      body: pinataForm,
    })

    if (!pinataRes.ok) {
      const text = await pinataRes.text()
      throw new Error(`Pinata error: ${text}`)
    }

    const { IpfsHash } = await pinataRes.json() as { IpfsHash: string }
    const url = `https://gateway.pinata.cloud/ipfs/${IpfsHash}`

    return NextResponse.json({ url, ipfsHash: IpfsHash })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
