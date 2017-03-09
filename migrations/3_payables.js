var mindfudge01 = artifacts.require("./mindfudge01.sol");
var mindfudge02 = artifacts.require("./mindfudge02.sol");
var oppo = "0xaec0b8a94ec86fdac2ccf53d5753fd238d3cd871";
var betSizeInWei = web3.toWei(2,"ether");
var gameTime = 3*60; //3 minutes
var fundTime = 30; 
module.exports = function(deployer) {
    deployer.deploy(mindfudge01, oppo,betSizeInWei);
    deployer.deploy(mindfudge02, oppo,
                    betSizeInWei,fundTime,gameTime);
};
