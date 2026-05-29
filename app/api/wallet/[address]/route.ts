import { getKrnBalance, checkPremiumAccess, checkPriorityAccess } from '@/lib/onchain'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  const { address } = params

  if (!address || !address.startsWith('0x')) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }

  try {
    const [balance, isPremium, isPriority] = await Promise.all([
      getKrnBalance(address),
      checkPremiumAccess(address),
      checkPriorityAccess(address)
    ])

    const tier = isPriority ? 'Priority' : isPremium ? 'Premium' : 'None'

    return NextResponse.json({ address, balance, tier, isPremium, isPriority })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
