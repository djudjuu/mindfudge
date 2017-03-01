var mft = artifacts.require("./mindfudge4etherTimed.sol");
contract('mindfudge4etherTimed', function(accounts) {
    it("should take bets during funding", function() {
        var numpy = accounts[1];
        var amount2 = web3.toWei(2, "ether" );
        var balanceBeforeBet;
        var balanceAfterBet;
        return mft.deployed().then(function(instance){
            game = instance;
            balanceBeforeBet = web3.eth.getBalance(mft.address).toNumber();
            return game.bet(numpy, {from: numpy, value: amount2});
        }).then(function() {
            balanceAfterBet = web3.eth.getBalance(mft.address).toNumber();
            assert.equal(0, balanceBeforeBet, "contract not empty");
            assert.equal(amount2, balanceAfterBet,
                         "amount did not arrive on contract");
        });
    });
    it("should reject refunding before the funding period expired by throwing an exception", function() {
        var numpy = accounts[1];
        var amount2 = web3.toWei(2, "ether" );
        var tmp;
        var balanceBeforeRefund;
        var balanceAfterRefund;
        return mft.deployed().then(function(instance){
            game = instance;
            balanceBeforeRefund = web3.eth.getBalance(mft.address).toNumber();
        }).then(function() {
            game.returnFunds({from:numpy});
        }).then(function() {
            balanceAfterRefund = web3.eth.getBalance(mft.address).toNumber();
            //now the contract shoudl throw, this what follows
            //is irrelevant
            assert.equal(balanceBeforeRefund, balanceAfterRefund,
                         "balance is not the same");
        });
    });
    it( "should accept them when the funding time expired", function() {
        var numpy = accounts[1];
        var bimu = accounts[0];
        var amount2 = web3.toWei(2, "ether" );
        var balanceBeforeRefund;
        var balanceAfterRefund;
        var tmp;
        setTimeout( function () {
            return mft.deployed().then(function(instance){
                game = instance;
                balanceBeforeRefund = web3.eth.getBalance(
                    mft.address).toNumber();
            }).then(function() {
                game.returnFunds({from:numpy});
            }).then(function() {
                balanceAfterRefund = web3.eth.getBalance(
                    mft.address).toNumber();
            }).then(function(p) {
                assert.equal(0,balanceBeforeRefund,"before not 2");
                assert.equal(2,balanceAfterRefund ,"after not 0");
                assert.equal(balanceAfterRefund, balanceBeforeRefund,
                                "did not get refunded");
            });
        },0*1000);
    });
});
    
