import { task } from 'hardhat/config'
import '@nomiclabs/hardhat-ethers'
import { Logger } from 'tslog'
import config from './config/config'
import { ethers } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import { DiffusionBar, MiniChefV2 } from '../dist/types'
import { deployedBytecode as localMiniChef } from '../artifacts/contracts/MiniChefV2.sol/MiniChefV2.json'
import { deployedBytecode as localXDiff } from '../artifacts/contracts/xDiff.sol/DiffusionBar.json'

const logger: Logger = new Logger()

const findFirstDiff = (str1: string[], str2: string[]) => [...str1].findIndex((el, index) => el !== str2[index]);

task('verify-deployed-bytecode')
    .setAction(async (args, hre) => {

        // Deploy transaction https://evm.evmos.org/tx/0x8bbb2efb5ffbbb485577b204547a9b45cd1a435345945a9319d587207faa32fd
        const deployedMiniChef = await hre.ethers.provider.getTransaction("0x8bbb2efb5ffbbb485577b204547a9b45cd1a435345945a9319d587207faa32fd");
        // Deploy transaction https://evm.evmos.org/tx/0x571c252c9658e281f6065241d007888df86942bf558d632f50d2fdfa09e6ee4d
        const deployedXDiff = await hre.ethers.provider.getTransaction("0x571c252c9658e281f6065241d007888df86942bf558d632f50d2fdfa09e6ee4d")

        const miniChefFactory = await hre.ethers.getContractFactory(`contracts/MiniChefV2.sol:MiniChefV2`);
        const xDiffFactory = await hre.ethers.getContractFactory(`contracts/xDiff.sol:DiffusionBar`);

        logger.info(deployedMiniChef.data === (miniChefFactory.getDeployTransaction(config.rewardToken)).data);
        logger.info(deployedXDiff.data === (xDiffFactory.getDeployTransaction(config.diffusion)).data);

    });

task('deploy-xdiffusion')
    .setAction(async (args, hre) => {
        const factory = await hre.ethers.getContractFactory(`contracts/xDiff.sol:DiffusionBar`);
        const instance = await factory.deploy(config.diffusion);

        await instance.deployed();

        logger.info(instance.address);
    });

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
            parseEther(config.rewardsPerSecond),
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