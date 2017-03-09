var mindfudge0 = artifacts.require("./mindfudge0.sol");
var oppo = "0xaec0b8a94ec86fdac2ccf53d5753fd238d3cd871";
module.exports = function(deployer) {
    deployer.deploy(mindfudge0, oppo);
};
