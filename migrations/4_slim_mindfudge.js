var mindfudge = artifacts.require("./mindfudge.sol");
var oppo = "0xaec0b8a94ec86fdac2ccf53d5753fd238d3cd871";
var betSizeInWei = web3.toWei(2,"ether");
var gameTime = 3*60; //3 minutes
var fundTime = 3*60; 
module.exports = function(deployer) {
    deployer.deploy(mindfudge, oppo,
                    betSizeInWei,fundTime,gameTime);
