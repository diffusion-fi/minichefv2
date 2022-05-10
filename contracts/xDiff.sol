// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract DiffusionBar is ERC20("xDiffusion", "xDIFF"){
    using SafeMath for uint256;
    IERC20 public diffusion;

    // Define the diffusion token contract
    constructor(IERC20 _diffusion) public {
        diffusion = _diffusion;
    }

    // Enter the bar. Pay some diffusions. Earn some shares.
    // Locks diffusion and mints xdiffusion
    function enter(uint256 _amount) public {
        // Gets the amount of diffusion locked in the contract
        uint256 totalDiff = diffusion.balanceOf(address(this));
        // Gets the amount of xdiffusion in existence
        uint256 totalShares = totalSupply();
        // If no xdiffusion exists, mint it 1:1 to the amount put in
        if (totalShares == 0 || totalDiff == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xdiffusion the diffusion is worth. The ratio will change overtime, as xdiffusion is burned/minted and diffusion deposited + gained from fees / withdrawn.
        else {
            uint256 what = _amount.mul(totalShares).div(totalDiff);
            _mint(msg.sender, what);
        }
        // Lock the diffusion in the contract
        diffusion.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your diffusions.
    // Unlocks the staked + gained diffusion and burns xdiffusion
    function leave(uint256 _share) public {
        // Gets the amount of xdiffusion in existence
        uint256 totalShares = totalSupply();
        // Calculates the amount of diffusion the xdiffusion is worth
        uint256 what = _share.mul(diffusion.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        diffusion.transfer(msg.sender, what);
    }
}