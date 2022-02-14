import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import { Logger } from 'tslog'
import config from './config/config'

const logger: Logger = new Logger()

task('deploy-minichef', 'Deploys MiniChefV2 contract')
    .setAction(async (args, hre) => {
        const factory = await hre.ethers.getContractFactory(`contracts/MiniChefV2.sol:MiniChefV2`);
        const instance = await factory.deploy(config.rewardToken);

        await instance.deployed();

        logger.info(instance.address);
    });


task('deploy-rewarder', 'Deploys ComplexRewarderTime contract')
    .setAction(async (args, hre) => {
        const factory = await hre.ethers.getContractFactory(`contracts/ComplexRewarderTime.sol:ComplexRewarderTime`);
        const instance = await factory.deploy(
            config.secondaryRewardToken,
            config.rewardsPerSecond,
            config.miniChef
        );

        await instance.deployed();

        logger.info(instance.address);
    });
