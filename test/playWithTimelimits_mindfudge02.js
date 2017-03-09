var mft = artifacts.require("./mindfudge02.sol");

//these test are not working correctly yet.
//2do: learn how to wait time
//2do: learn how to catch exceptions

contract('mindfudge02', function(accounts) {
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
    it("should reject refunding before the funding period expired by THROWING an exception (this test should fail)", function() {
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
    /*
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
    });*/
});
    

/*
contract('mindfudge02', function(accounts) {
    it("should THROW 'INVALID JUMP' to reject a played card before both players are funded", function() {
        var bimu = accounts[0];
        var numpy = accounts[1];
        var don = accounts[2];
        var b1 = 1;
        return mft.deployed().then(function(instance) {
            game = instance;
            return game.playACard(1, {from:bimu});
        }).then(function() {
            return game.getMiddle.call();
        }).then(function(middle) {
            middle0 = middle[0].toNumber();
            assert.equal(middle0,0,"card was played unfunded");
        });
    });
    it("should accept funds from different addresses, then open the game", function() {
        var bimu = accounts[0];
        var numpy = accounts[1];
        var don = accounts[2];
        var amount1 = web3.toWei(1, "ether" );
        var amount2 = web3.toWei(2, "ether" );
        return mft.deployed().then(function(instance){
            game = instance;
            return game.bet(bimu, {from: bimu, value: amount2});
        }).then(function() {
            return game.bet(numpy, {from: numpy, value: amount1});
        }).then(function() {
            return game.bet(numpy, {from: don, value: amount1});
        }).then(function() {
            return game.playACard(2, {from:bimu});
        }).then(function() {
            return game.getMiddle.call()
        }).then(function(middle) {
            middle0 = middle[0].toNumber();
            assert.equal(middle0, 2 ,"card was not played");
        });
    });
    it("should sent ether to the winner", function() {
        var bimu = accounts[0];
        var numpy = accounts[1];
        var potBefore;
        var potAfter;
        var bimuWins;
        return mft.deployed().then(function(instance) {
            game = instance;
            return game.potSize.call();
        }).then(function(pot1) {
            potBefore = pot1.toNumber();
            //play cards until game over
            return game.playACard(1,{from:numpy});
        }).then(function() {
            return game.playACard(3,{from:bimu});
        }).then(function() {
            return game.playACard(2,{from:numpy});
        }).then(function() {
            return game.playACard(4,{from:bimu});
        }).then(function() {
            return game.playACard(3,{from:numpy});
        }).then(function() {
            return game.potSize.call();
        }).then(function(pot2) {
            potAfter = pot2.toNumber();
            return game.didIWin(bimu, {from:bimu});
        }).then(function(winnerBool) {
            bimuWins = winnerBool;
            return game.score.call();
        }).then(function(score) {
            b = score[0].toNumber();
            n = score[1].toNumber();
            assert.equal(b,3,"bimu did not win all rounds");
            assert.equal(n,0,"numpy did not win all rounds");
            assert.equal(bimuWins, true, "bimu was not registered as winner");
            assert.equal(potBefore, web3.toWei(4,"ether") , "pot did not hold 4 ether");
            assert.equal(potAfter, 0 , "payout did not happen");
        });
    });
});*/
