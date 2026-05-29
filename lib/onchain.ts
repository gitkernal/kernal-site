import { createPublicClient, http, parseUnits, formatUnits } from 'viem'
import { base } from 'viem/chains'

const KRN_CA = '0x974B53861d975E727305298D2718849c43046ba3' as `0x${string}`

const KRN_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }]
  }
] as const

const PREMIUM_THRESHOLD = parseUnits('10000000', 18)
const PRIORITY_THRESHOLD = parseUnits('100000000', 18)

const client = createPublicClient({
  chain: base,
  transport: http(process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org')
})

export async function getKrnBalance(address: string): Promise<string> {
  const balance = await client.readContract({
    address: KRN_CA,
    abi: KRN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`]
  })
  return formatUnits(balance as bigint, 18)
}

export async function checkPremiumAccess(address: string): Promise<boolean> {
  const balance = await client.readContract({
    address: KRN_CA,
    abi: KRN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`]
  }) as bigint
  return balance >= PREMIUM_THRESHOLD
}

export async function checkPriorityAccess(address: string): Promise<boolean> {
  const balance = await client.readContract({
    address: KRN_CA,
    abi: KRN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`]
  }) as bigint
  return balance >= PRIORITY_THRESHOLD
}
