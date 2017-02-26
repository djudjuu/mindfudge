var mf = artifacts.require("./mindfudge.sol");
// bimus plays: 1 3 2
// numpy plays: 2 3 (3,4)
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
        var bimu = accounts[0];
        var b1 = 1;
        //save gamecontract in game 
        return mf.deployed().then(function(instance) {
            game = instance;
            //play a card from numpys
            return game.playACard(b1, {from:bimu})
            //return game.dummyCard(b1 , {from:bimu})
        }).then(function() {
            //check the middle field
            return game.getMiddle.call();
        }).then(function(middlecards) {
            middle0 = middlecards[0].toNumber();
            //assert.equal(middlecards[1], 0, "numpys's field is empty and...");
            assert.equal(middle0, b1, "bimus card did not make it into the middle");
        });
    });
    it("should compare two played cards and reset the game ",function() {
        var numpy = accounts[1];
        var bimu = accounts[0];
        var n1 = 2;
        //save gamecontract in game 
        return mf.deployed().then(function(instance) {
            game = instance;
            //play a card from numpys account
            return game.playACard(n1, {from:numpy})
            //return game.dummyCard(n1, {from:numpy})
            
            //read what is in the middle (should be reset to zero:
        }).then(function() {
            return game.getMiddle.call();
        }).then(function(middlecards) {
            mc = middlecards;
            middle0 = middlecards[0].toNumber();
            middle1 = middlecards[1].toNumber();

            //get the score (1:0)
            return game.score.call();
        }).then(function(scoreAfterOneRound) {
            scoreBimu = scoreAfterOneRound[0];
            scoreNumpy = scoreAfterOneRound[1];

            //do assertions
            assert.equal(scoreBimu, 0, "Bimu did not loose one round");
            assert.equal(scoreNumpy, 1, "Numpy does not have 1 points");
            assert.equal(middle0, 0, "field 0 not empty");
            assert.equal(middle1, 0, "field 1 not empty");
            //assert.equal(mc, [0,0], "the middlecards is not empty after reveal");
            //assert.equal([middle0,middle1], [0,0], "the middle is not empty after reveal");
        });
    });
    it("Numpy should put a card on the second field of the middle",function() {
        var n2 = 3;
        var numpy = accounts[1];
        //save gamecontract in game 
        return mf.deployed().then(function(instance) {
            game = instance;
            
            //play a card from numpys account:
            return game.playACard(n2, {from:numpy})
        }).then(function() {

            //get middle:
            return game.getMiddle.call();
        }).then(function(middlecards) {
            middle1 = middlecards[1]//.toNumber();
            //assert.equal(middlecards, 0, "bimu's field is empty and...");
            assert.equal(middle1, n2, "numpys card did not make it into the middle");

        });
    });
    it("should recognize a draw and augment winning points of the next round", function() {
        //play another card from bimu that matches numpy's (3):
        var b2 = 3;
        var bimu = accounts[0];
        return mf.deployed().then(function(instance) {
            game = instance;
            //play a card from bimus account:
            return game.playACard(b2, {from:bimu})
        }).then( function() {
            //get score (should be still 0:1)
            return game.score.call();
        }).then(function(scoreAfterRoundTwo) {
            scoreBimu = scoreAfterRoundTwo[0].toNumber();
            scoreNumpy = scoreAfterRoundTwo[1].toNumber();

            //do assertions
            assert.equal(scoreBimu, 0, "Bimu did not loose one round");
            assert.equal(scoreNumpy, 1, "Numpy does not have 1 points");
        });
      });
    it("should prevent players from playing the same card twice or playing nonexisting cards", function() {
        var n3 = 3
        var numpy = accounts[1];
        //save gamecontract in game 
        return mf.deployed().then(function(instance) {
            game = instance;
            //play a card from numpyesaccount
            //the same card he already played before
            return game.playACard(n3, {from:numpy})
        }).then(function() {
            //a card that does not exist
            return game.playACard(100, {from:numpy})
        }).then(function() {
            return game.getMiddle.call();
        }).then(function(middlecards) {
            middle1 = middlecards[1]//.toNumber();
            //assert.equal(middlecards, 0, "bimu's field is empty and...");
            assert.equal(middle1, 0, "numpy played an illegal card");
        });
    });
       it("should recognize when the game is over", function() {
           var n3 = 4;
           var b3 = 2;
           var numpy = accounts[1];
           var bimu = accounts[0];
           //save gamecontract in game 
           return mf.deployed().then(function(instance) {
               game = instance;
               //play a card from numpyesaccount
               return game.playACard(n3, {from:numpy})
           }).then(function() {
               //play a card from bimus account
               return game.playACard(b3, {from:bimu})
           }).then( function() {
               return game.score.call();
           }).then( function(endScore) {
               scoreBimu = endScore[0].toNumber();
               scoreNumpy = endScore[1].toNumber();
               return game.didIWin.call({from:numpy});
           }).then( function(NsWin) {
               numpyWins = NsWin;
               //do assertions
               assert.equal(scoreBimu, 0, "Bimu did not loose");
               assert.equal(scoreNumpy, 3, "Numpy did not win");
               assert.equal(numpyWins, true, "Numpy could not query he won");
           });
       });
});
