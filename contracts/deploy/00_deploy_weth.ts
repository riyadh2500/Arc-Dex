// Arc Network — deploy WUSDC (Wrapped native USDC)
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// On Arc the native gas token is USDC, not ETH.
// MockWETH is repurposed as MockWUSDC — it wraps native USDC into an ERC-20
// so the DEXRouter can handle native↔token swaps uniformly.
// Skip this script on Arc mainnet if you use the real USDC ERC-20 interface directly.

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log('─────────────────────────────────────────────────────')
  log(`Network : ${network.name} (chainId: ${network.config.chainId})`)
  log('Deploying WUSDC (Wrapped native USDC for Arc) ...')

  const wusdc = await deploy('MockWETH', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  })

  log(`✅ WUSDC deployed at: ${wusdc.address}`)
}

func.tags = ['WETH', 'WUSDC', 'all']
export default func
