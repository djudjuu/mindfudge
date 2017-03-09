pragma solidity ^0.4.8;

///mindfudge version where opponents can play for ether
contract mindfudge01 {
  /* This declares a new complex typce for a Player*/
  struct Player
  {
    address addr;
    bool[5] cards;
    uint points;
  }
  address owner;
  uint betSize; //in Wei
  uint[2] deposits;
  Player[2] players;
  uint[2] middle = [0,0];
  uint drawpot = 0; //extrapoints 4 draws
  uint[2] clocks;
  //clocks are counters who dawdled the most time
  uint waitingTime; //measured here
  uint public fundingStart; //time of contract creation
  uint public fundTime = 10*60;//10 minutes time to commit funds
  uint public gameEndTime;
  uint public gameDuration; // in seconds
  address mindfudger; //address of winner
  /*later: 
  //uint lenGame = 5;*/
  event playerIsFunded(address);  
  event waiting4(address slowDude);
  event cardsRevealed(uint card1, uint card2);
  event logString(string);
  event gameEnded(string text, uint winnerIdx);
  
  modifier betsArePlaced( ) {
    if ( deposits[0] < betSize || deposits[1] < betSize)
      throw; _;
  }
  modifier onlyAfterFundingRound() {
    if ( now > fundingStart + fundTime )
      throw; _;
  }
  //Attention: this modifier requires the end of the game to be set
  modifier beforeGameEnded() {
    if ( now > gameEndTime )
      throw; _;
  }

  //use this once I can catch exceptions in tests
  //modifier inRange(uint _card) { if (_card < 1 || _card > 5)  throw; _; }
  
  function mindfudge01(address enemy, uint _betSizeInWei )
  {
    fundingStart = now;
    betSize = _betSizeInWei;
    gameDuration = 20;
    owner = msg.sender;
    players[0] = Player({
      addr: owner,
          cards:[true, true, true ,true, true],
          points: 0,
          });
    players[1] = Player({
      addr: enemy,
          cards:[true, true, true ,true, true],
          points: 0,
          });              
  }
//function to place ether as bet
  function bet(address beneficiary)
    payable
  {
    uint to;
    if (beneficiary == players[0].addr) { to = 0;}
    else { to = 1;}
    deposits[to] += msg.value;
    if (deposits[to] >= betSize){
      playerIsFunded(beneficiary);
      if (deposits[0] >= betSize && deposits[1] >= betSize) {
        //both players funded!
        startGame();
      }
    }
  }
  //if one player fails to place a bet, this function can be
  //called by the other one so he will be refunded
  function returnFunds() 
    onlyAfterFundingRound
  {
    if ( msg.sender == players[0].addr &&
         deposits[1]<betSize){
      if (!msg.sender.send(deposits[0])) throw;
    } else if (msg.sender == players[1].addr &&
               deposits[0]<betSize) {
      if (!msg.sender.send(deposits[1])) throw;
        }
  }
    
  function startGame() internal {
    gameEndTime = now + gameDuration;
  }
    

    /*function to put a card that has not been played in the middle*/
    function playACard(uint card)
      //inRange(card)
      betsArePlaced()
        {
      /*which player sent the card?*/
      uint pIdx;
      if (msg.sender == players[0].addr)
        {
        pIdx = 0;
        }
      else
        {
          if (msg.sender == players[1].addr)
            {
              pIdx = 1;
            }
          else
            {
              logString("you are not part of the game");
            throw;
            }
        }
      //check whether card is in legal range (TODO: find out how to
      //catch exceptions in tests
      //AND whether the card has not been played  before
      //AND whether the player has not played in this round before
      if (0 < card && card < 6){
        if (players[pIdx].cards[card-1]) {
          if(middle[pIdx] == 0) {
            players[pIdx].cards[card-1] = false;
            middle[pIdx] = card;
            //fire events:
            logString("card Played!Now waiting 4:");
          } else
            {
              logString("there already was a card in the middle");
            }
        } else
          {
            logString("illegal card! (already played)");
          }
      } else
        {
          logString("illegal card! (out of game range)");
        }
      /*both players have submitted a card?*/
      if (middle[0] != 0 && middle[1] != 0) {
        //slower player gets the waited time added on his clock
        clocks[pIdx] += now - waitingTime;
        //also cards are revealed :D
        reveal();
        }
      else
        {
          waiting4(players[1-1**pIdx].addr);
          //first player gets to reset the waiting time clock to now
          waitingTime = now;
          
        }
    }
    
    /*function to find out whose card is higher and assign points*/
    function reveal() internal{
      /*DRAW: no one gets a point, but next round is for one more*/
      if ( middle[0] == middle[1] ) {
            drawpot += 1;
      }
      else
        {
          uint winneridx;
          //determine winner:
          if ( middle[0]>middle[1] ) {
              winneridx = 0;
          } else { winneridx = 1;}
          //fire event:
          cardsRevealed(middle[0], middle[1]);

          /* augment winners score*/
          players[winneridx].points += 1 + drawpot;
          /*and reset possible extrapoints*/
          drawpot = 0;

          //*check if one player has more than half of the cards*/
          if ( players[winneridx].points > 2 )
            {
              endGame(winneridx);
            }
       
      //*reset middle*/
      middle = [0,0];
    }
    if ( players[0].points + players[1].points + drawpot > 5) {
       //all points given out, but no one has more than 2
       //game ends as a draw
       endGame(2);
    } 
    }

    //*function to declare the game ended/
    //later: payOut Winner*/
    function endGame(uint winner) internal
    {
      gameEnded("game is Over and the winner is: ", winner);
      mindfudger = players[winner].addr;
      if (!mindfudger.send(betSize*2)) { throw;}
      else {
        deposits = [0,0];
        logString("winner paid out");}
    }

    function payOutBoth() internal
    {
      logString("paying Out both!");
      if ( !players[0].addr.send(deposits[0]) &&
           !players[1].addr.send(deposits[1])) 
      {
        logString("something did not work");
        throw;
      }
      else
        {
          //suicide;
        }
     }


    //convenience functions to learn, get Stats and debug flow within remix

    //*queryfunction to find out whether you won*/
    function didIWin() constant returns (bool won) {
        won = msg.sender == mindfudger;
        return won;
    }
    function potSize() constant returns (uint) {
      return deposits[0] + deposits[1];
    }

    //*function to return current score*/
    function score() constant returns (uint[2] scores) {
        scores = [ players[0].points, players[1].points ];
    }

    function getMiddle() constant returns (uint[2]){
      return middle;
    }

    function showCards(uint pIdx) constant returns (bool[5]){
      return players[pIdx].cards;
    }
}



