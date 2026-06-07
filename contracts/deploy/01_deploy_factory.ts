// Arc Network — deploy DEXFactory
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  log('─────────────────────────────────────────────────────')
  log(`Network : ${network.name} (chainId: ${network.config.chainId})`)
  log('Deploying DEXFactory ...')

  const factory = await deploy('DEXFactory', {
    from: deployer,
    // feeToSetter = deployer; call setFeeTo() after deployment to enable protocol fee
    args: [deployer],
    log: true,
    autoMine: true,
  })

  log(`✅ DEXFactory deployed at: ${factory.address}`)
}

func.tags = ['Factory', 'all']
export default func
