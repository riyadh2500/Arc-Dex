// Arc Network — deploy TokenFactory
// Builder: @riyadhisla58886 | https://x.com/riyadhisla58886
//
// creationFee is in native USDC (18-decimal units at msg.value level).
// Default: 0.5 USDC = 5e17 (i.e. 500_000_000_000_000_000).
// Adjust ARC_TOKEN_CREATION_FEE in your .env to override.

import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { parseEther } from 'ethers'

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()

  // Fee: default 0.5 native USDC, overridable via env
  const feeString   = process.env.ARC_TOKEN_CREATION_FEE || '0.5'
  const creationFee = parseEther(feeString)

  // Fee receiver: default to deployer, overridable via env
  const feeReceiver = process.env.ARC_FEE_RECEIVER || deployer

  log('─────────────────────────────────────────────────────')
  log(`Network      : ${network.name} (chainId: ${network.config.chainId})`)
  log(`Creation fee : ${feeString} native USDC (${creationFee.toString()} wei)`)
  log(`Fee receiver : ${feeReceiver}`)
  log('Deploying TokenFactory ...')

  const tokenFactory = await deploy('TokenFactory', {
    from: deployer,
    args: [creationFee, feeReceiver],
    log: true,
    autoMine: true,
  })

  log(`✅ TokenFactory deployed at: ${tokenFactory.address}`)
}

func.tags = ['TokenFactory', 'all']
export default func
