var mindfudge = artifacts.require("./mindfudge.sol");
var oppo = "0xaec0b8a94ec86fdac2ccf53d5753fd238d3cd871";
module.exports = function(deployer) {
    deployer.deploy(mindfudge, oppo);
};
