import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import { Logger } from 'tslog'
import config from './config/config'
import { ethers } from 'ethers'

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

task("verify-minichef", "Verifies MiniChefV2 Contract")
    .setAction(
        async (args, hre) => {
            await hre.run("verify:verify", {
                address: config.miniChef,
                constructorArguments: [
                    config.rewardToken
                ],
                contract: "contracts/MiniChefV2.sol:MiniChefV2"
            });
        }
    );

task("verify-rewarder", "Verifies rewarder Contract")
    .setAction(
        async (args, hre) => {
            await hre.run("verify:verify", {
                address: config.complexRewarderTime,
                constructorArguments: [
                    config.secondaryRewardToken,
                    ethers.utils.parseEther(config.rewardsPerSecond),
                    config.miniChef
                ],
                contract: "contracts/ComplexRewarderTime.sol:ComplexRewarderTime"
            });
        }
    );