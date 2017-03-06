var mft2 = artifacts.require("./mindfudge4etherTimed.sol");

//when this test is run with truffle test/testdraw.js it passes
//only when it is run after other ones it fails....2do: find out why

contract('mindfudge4etherTimedDraw', function(accounts) {
    it("should pay out both players if there is a draw", function() {
        var bimu = accounts[0];
        var numpy = accounts[1];
        var bBefore;
        var nBefore;
        var bAfter;
        var nAfter;
        var bimuWins=false;
        var numpyWins=false;
        var amount2 = web3.toWei(2, "ether");
        return mft2.deployed().then(function(instance) {
            game = instance;
            //fund players:
            return game.bet(bimu, {from: accounts[3],
                                   value: amount2});
        }).then(function() {
            return game.bet(numpy, {from: accounts[2],
                                    value: amount2});
        }).then(function() {
            bBefore = web3.eth.getBalance(bimu);
            nBefore = web3.eth.getBalance(numpy);
            return game.playACard(2,{from:numpy});
        }).then(function() {
            return game.playACard(1,{from:bimu});
        }).then(function() {
            return game.playACard(1,{from:numpy});
        }).then(function() {
            return game.playACard(2,{from:bimu});
        }).then(function() {
            return game.playACard(3,{from:numpy});
        }).then(function() {
            return game.playACard(3,{from:bimu});
        }).then(function() {
            return game.playACard(5,{from:numpy});
        }).then(function() {
            return game.playACard(5,{from:bimu});
        }).then(function() {
            return game.playACard(4,{from:numpy});
        }).then(function() {
            return game.playACard(4,{from:bimu});
        }).then(function() {
            bAfter = web3.eth.getBalance(bimu);
            nAfter = web3.eth.getBalance(numpy);
            return game.potSize.call();
        }).then(function(pot2) {
            potAfter = pot2.toNumber();
            assert.equal(potAfter, 0 , "payout did not happen");
            assert.notEqual(bBefore, bAfter, "bimu did not get paid");
            assert.notEqual(nBefore, nAfter, "numpy did not get paid");
        });
    }); 
});

