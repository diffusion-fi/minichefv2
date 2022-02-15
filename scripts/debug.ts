import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import { Logger } from 'tslog'
import config from './config/config'
import { BigNumber, ethers } from 'ethers'
import { MiniChefV2, IMasterChef } from '../dist/types'

const logger: Logger = new Logger()

task('debug', 'Debug calls')
  //npx hardhat debug
  .setAction(async (args, hre) => {
    const instance = (await hre.ethers.getContractAt('MiniChefV2', config.miniChef)) as MiniChefV2

    const l = await instance.poolLength()
    logger.info(l)

    // const pool = await instance.poolInfo(0)
    // logger.info(pool)
  })
