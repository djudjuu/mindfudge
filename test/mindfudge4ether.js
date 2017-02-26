var mfe = artifacts.require("./mindfudge4ether.sol");

contract('mindfudge4ether', function(accounts) {
    it("should THROW to reject a played card before both players are funded", function() {
        var bimu = accounts[0];
        var numpy = accounts[1];
        var don = accounts[2];
        var b1 = 1;
        return mfe.deployed().then(function(instance) {
            game = instance;
            return game.playACard(1, {from:bimu});
        }).then(function() {
            return game.getMiddle().call();
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
        return mfe.deployed().then(function(instance){
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
});

