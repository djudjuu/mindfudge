var mindfudge = artifacts.require("./mindfudge.sol");
var mindfudge4ether = artifacts.require("./mindfudge4ether.sol");
var oppo = "0xaec0b8a94ec86fdac2ccf53d5753fd238d3cd871";
var betSizeInWei = web3.toWei(2,"ether");
module.exports = function(deployer) {
    deployer.deploy(mindfudge, oppo);
    deployer.deploy(mindfudge4ether, oppo,betSizeInWei);
};
