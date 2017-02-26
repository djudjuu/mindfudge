var mf = artifacts.require("./mindfudge.sol");
var mindfudge4ether = artifacts.require("./mindfudge4ether.sol");
var oppo = "0xaec0b8a94ec86fdac2ccf53d5753fd238d3cd871"
module.exports = function(deployer) {
    deployer.deploy(mf, oppo);
    deployer.deploy(mindfudge4ether, oppo,2);
};
