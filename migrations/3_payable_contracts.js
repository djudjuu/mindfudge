//var mindfudge = artifacts.require("./mindfudge.sol");
//var mindfudge4ether = artifacts.require("./mindfudge4ether.sol");
var mindfudge4etherTimed = artifacts.require("./mindfudge4etherTimed.sol");
var oppo = "0xaec0b8a94ec86fdac2ccf53d5753fd238d3cd871";
var betSizeInWei = web3.toWei(2,"ether");
var gameTime = 3*60; //3 minutes
var fundTime = 30; 
module.exports = function(deployer) {
    //deployer.deploy(mindfudge, oppo);
    //deployer.deploy(mindfudge4ether, oppo,betSizeInWei);
    deployer.deploy(mindfudge4etherTimed, oppo,betSizeInWei,fundTime,gameTime);
    //deployer.deploy(mindfudge4etherTimed,betSizeInWei,fundTime,gameTime);
};
