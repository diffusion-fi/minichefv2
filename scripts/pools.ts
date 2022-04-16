import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import { Logger } from 'tslog'
import config from './config/config'
import { ComplexRewarderTime, MiniChefV2 } from '../dist/types'
import { parseEther } from 'ethers/lib/utils'

const logger: Logger = new Logger()

task('set-emission')
    .setAction(async (args, hre) => {
        const instance = await hre.ethers.getContractAt("MiniChefV2", config.miniChef) as MiniChefV2;

        const res = await instance.setDiffusionPerSecond(parseEther(config.rewardsPerSecond));

        logger.info(res);
    });

task('set-emission-complexreward')
    .setAction(async (args, hre) => {
        const instance = await hre.ethers.getContractAt("ComplexRewarderTime", config.complexRewarderTime) as ComplexRewarderTime;

        const res = await instance.setRewardPerSecond(parseEther(config.rewardsPerSecond));

        logger.info(res);
    });

task('add-pool', 'Adds Pool')
    .addParam('allocpoint', 'Pool allocation points')
    .addParam('lptoken', 'LP token for the pool')
    .setAction(async (args, hre) => {
        const instance = await hre.ethers.getContractAt("MiniChefV2", config.miniChef) as MiniChefV2;

        const res = await instance.add(args.allocpoint, args.lptoken, config.complexRewarderTime);

        logger.info(res);
    });

task('add-rewarder', 'Adds Pool to complexRewarder')
    .addParam('allocpoint', 'Pool allocation points')
    .addParam('pid', 'Pool ID for the pool')
    .setAction(async (args, hre) => {
        const instance = await hre.ethers.getContractAt("ComplexRewarderTime", config.complexRewarderTime) as ComplexRewarderTime;

        const res = await instance.add(args.allocpoint, args.pid);

        logger.info(res);
    });