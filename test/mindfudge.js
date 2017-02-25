var mf = artifacts.require("./mindfudge.sol");

//the first player should be the initiator of the contract- address 0
contract('mindfudge', function(accounts) {
    it("should have bimu's adress as player 1", function() {
        return mf.deployed().then(function(instance) {
            return instance.getOwner.call();
        }).then(function(owner) {
            assert.equal(owner, accounts[0], "Bimu did not own the mindfudge game");
        });
    });
    it("should have numpy as second player (matchup-call)", function() {
        return mf.deployed().then(function(instance) {
            return instance.matchup.call();
        }).then(function(players) {
            assert.equal(players[1], accounts[1], "Whoever is the opponent, its not numpy");
        });
    });

//test for playing A Card works for both players         
    it("Bimu should put a card on the first field of the middle",function() {
        var card1 = 1;
        var bimu = accounts[0];
        //save gamecontract in game 
        return mf.deployed().then(function(instance) {
            game = instance;
            //play a card from bimus account
            return game.dummyCard(card1, {from:bimu})
        }).then(function() {
            return game.getMiddle.call();
        }).then(function(middlecards) {
            assert.equal(middlecards[0], card1, "bimus card did not make it into the middle");
        });
    });
    it("Numpy should put a card on the second field of the middle",function() {
        var card1 = 1;
        var numpy = accounts[1];
        //save gamecontract in game 
        return mf.deployed().then(function(instance) {
            game = instance;
            //play a card from bimus account
            return game.dummyCard(card1, {from:numpy})
        }).then(function() {
            return game.getMiddle.call();
        }).then(function(middlecards) {
            assert.equal(middlecards[1], card1, "bimus card did not make it into the middle");
        });
    });
      

});
