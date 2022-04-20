import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import { Logger } from 'tslog'
import config from './config/config'
import { ComplexRewarderTime, MiniChefV2 } from '../dist/types'
import { BigNumber } from 'ethers'

const logger: Logger = new Logger()

task('set-emission', 'Set Emission').setAction(async (args, hre) => {
  const instance = (await hre.ethers.getContractAt('MiniChefV2', config.miniChef)) as MiniChefV2

  const res = await instance.setDiffusionPerSecond(config.rewardsPerSecond)

  logger.info(res)
})

task('set-pool-share', 'Set Pool Share').setAction(async (args, hre) => {
  const instance = (await hre.ethers.getContractAt('MiniChefV2', config.miniChef)) as MiniChefV2

  // const length = await instance.set(BigNumber.from(0),BigNumber.from(100),)
  logger.info('Length', length)
  1
  const res = await instance.poolInfo(BigNumber.from(0))

  logger.info('PoolInfo', res)
})

task('log-emission', 'Log Emission').setAction(async (args, hre) => {
  const instance = (await hre.ethers.getContractAt('MiniChefV2', config.miniChef)) as MiniChefV2

  const length = await instance.poolLength()
  logger.info('Length', length)

  const res = await instance.poolInfo(BigNumber.from(0))
  logger.info('PoolInfo', res)

  const globalPerSecond = await instance.diffusionPerSecond()

  logger.info(globalPerSecond)
})

task('add-pool', 'Adds Pool')
  .addParam('allocpoint', 'Pool allocation points')
  .addParam('lptoken', 'LP token for the pool')
  .setAction(async (args, hre) => {
    const instance = (await hre.ethers.getContractAt('MiniChefV2', config.miniChef)) as MiniChefV2

    const res = await instance.add(args.allocpoint, args.lptoken, config.complexRewarderTime)

    logger.info(res)
  })

task('add-rewarder', 'Adds Pool to complexRewarder')
  .addParam('allocpoint', 'Pool allocation points')
  .addParam('pid', 'Pool ID for the pool')
  .setAction(async (args, hre) => {
    const instance = (await hre.ethers.getContractAt(
      'ComplexRewarderTime',
      config.complexRewarderTime
    )) as ComplexRewarderTime

    const res = await instance.add(args.allocpoint, args.pid)

    logger.info(res)
  })
