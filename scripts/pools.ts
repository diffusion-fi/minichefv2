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

task('add-lp')
    .setAction(async (args, hre) => {
        const instance = await hre.ethers.getContractAt("MiniChefV2", "0x067eC87844fBD73eDa4a1059F30039584586e09d") as MiniChefV2;

        const res = await instance.deposit(3, 10000000000, "0xc52670C4D0efc17E81f84e7cD1787D212AF47FaC");

        logger.info(res);
    });