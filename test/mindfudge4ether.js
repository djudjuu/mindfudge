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
    it("should sent ether to the winner", function() {
        var bimu = accounts[0];
        var numpy = accounts[1];
        var potBefore;
        var potAfter;
        var bimuWins;
        return mfe.deployed().then(function(instance) {
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
});

