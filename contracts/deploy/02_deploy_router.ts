// Arc Network — deploy DEXRouter
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// The Router takes (factory, WETH) — on Arc, WETH = WUSDC contract address.

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, get, log } = deployments
  const { deployer } = await getNamedAccounts()

  const factory = await get('DEXFactory')
  const wusdc   = await get('MockWETH')   // WUSDC on Arc

  log('─────────────────────────────────────────────────────')
  log(`Network  : ${network.name} (chainId: ${network.config.chainId})`)
  log(`Factory  : ${factory.address}`)
  log(`WUSDC    : ${wusdc.address}`)
  log('Deploying DEXRouter ...')

  const router = await deploy('DEXRouter', {
    from: deployer,
    args: [factory.address, wusdc.address],
    log: true,
    autoMine: true,
  })

  log(`✅ DEXRouter deployed at: ${router.address}`)
}

func.tags = ['Router', 'all']
func.dependencies = ['Factory', 'WETH']
export default func
