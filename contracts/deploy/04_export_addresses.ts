// Arc Network — export deployed addresses to frontend
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// Writes/updates the correct NEXT_PUBLIC_*_<NETWORK> vars in
// frontend/.env.local after every deployment.

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import * as fs from 'fs'
import * as path from 'path'

// Map hardhat network names → frontend env suffixes
const NETWORK_SUFFIX: Record<string, string> = {
  localhost:   'LOCALHOST',
  hardhat:     'LOCALHOST',
  arcTestnet:  'ARC_TESTNET',
}

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, network } = hre
  const { get, log } = deployments

  const suffix = NETWORK_SUFFIX[network.name] ?? network.name.toUpperCase().replace(/[^A-Z0-9]/g, '_')

  const factory      = await get('DEXFactory')
  const router       = await get('DEXRouter')
  const tokenFactory = await get('TokenFactory')
  const wusdc        = await get('MockWETH')

  const envPath = path.resolve(__dirname, '../../frontend/.env.local')
  let   envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : ''

  const updates: Record<string, string> = {
    [`NEXT_PUBLIC_FACTORY_${suffix}`]:       factory.address,
    [`NEXT_PUBLIC_ROUTER_${suffix}`]:        router.address,
    [`NEXT_PUBLIC_TOKEN_FACTORY_${suffix}`]: tokenFactory.address,
    [`NEXT_PUBLIC_WETH_${suffix}`]:          wusdc.address,
  }

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, 'm')
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`)
    } else {
      envContent += `\n${key}=${value}`
    }
  }

  fs.writeFileSync(envPath, envContent.trimStart())

  log('─────────────────────────────────────────────────────')
  log(`✅ Addresses exported to frontend/.env.local [${suffix}]`)
  for (const [k, v] of Object.entries(updates)) log(`   ${k}=${v}`)
}

func.tags = ['Export', 'all']
func.dependencies = ['Factory', 'Router', 'TokenFactory', 'WETH']
func.runAtTheEnd = true
export default func
