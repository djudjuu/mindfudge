pragma solidity ^0.4.8;
/// @title play mindfudge for ether and within a time limit
contract mindfudge4etherTimed {
  /* This declares a new complex typce for a Player*/
  struct Player
  {
    address addr;
    bool[5] cards;
    uint points;
  }
  address owner;
  uint round;
  uint betSize; //in Wei
  uint[2] deposits;
  Player[2] players;
  uint[2] middle = [0,0];
  uint drawpot = 0; //extrapoints 4 draws
  uint[2] clocks =[0,0];
  //clocks are counters who dawdled the most time
  uint waitingTime; //measured here
  uint public fundingStart; //time of contract creation
  uint public fundTime;//10 minutes time to commit funds
  uint public gameDuration; // in seconds
  uint public gameEndTime;
  address mindfudger; //address of winner

  event playerIsFunded(address);  
  event waiting4(address slowDude);
  event cardsRevealed(uint card1, uint card2);
  event logString(string);
  event gameEnded(string text, uint winnerIdx);
  
  modifier betsArePlaced() {
    if ( deposits[0] < betSize || deposits[1] < betSize)
      throw; _;
  }
  modifier onlyBefore(uint _time) { if (now >= _time) throw; _; }
  modifier onlyAfter(uint _time) { if (now <= _time) throw; _; }
  // if ( now < fundingStart + fundTime ){throw;}
  
  //see if card is in legal range 
  modifier inRange(uint _card) {
    if (_card < 1 || _card > 5) throw; _;
  }

  /**
 create a new mindfudge game 
 @param opponent your friends address, -
 @param _betSizeInWei the amount of ether you want to play for (inWei) -
 @param _gameDuration the game duration in seconds (after it
  ends, the contract will suicide and send all its funds to the
  player, who lost the least amount of time before playing his
  cards).
 @param _fundTime timeWindow after creation during which funds can be placed
**/
  function mindfudge4etherTimed(
                                address opponent,
                                uint _betSizeInWei,
                                uint _fundTime,
                                uint _gameDuration)
  {
    fundingStart = now;
    betSize = _betSizeInWei;
    gameDuration = _gameDuration;
    fundTime = _fundTime;
    gameEndTime = fundingStart + fundTime + gameDuration;
    owner = msg.sender;
    round = 0;
    players[0] = Player({
      addr: owner,
          cards:[true, true, true ,true, true],
          points: 0,
          });
    players[1] = Player({
      addr: opponent,
          cards:[true, true, true ,true, true],
          points: 0,
          });              
  }
///function to place ether as bet
  function bet(address beneficiary)
    payable
    onlyBefore(fundingStart + fundTime)
  {
    uint to;
    if (beneficiary == players[0].addr) { to = 0;}
    else { to = 1;}
    deposits[to] += msg.value;
    if (deposits[to] >=  betSize)
      {
        playerIsFunded(beneficiary);
        //if (deposits[1-1**to] >= betSize) {
        if (deposits[0] >= betSize && deposits[1] >= betSize)
          {
            //both players funded!
            gameEndTime = now + gameDuration;
            //gameEndTime -= fundTime - (now-fundingStart);
          }
      }
  }
  /**
  return Funds if one player fails to place a bet. this function can be
  called by the other one so he will be refunded
  the player who committed to little can not be refunded
  his ether goes to the other one as well
  **/
  function returnFunds() 
    onlyAfter(fundingStart + fundTime)
    returns (bool)
  {
    //return msg.sender.send(this.balance);
    if ( msg.sender == players[0].addr &&
         deposits[1]<betSize){
      if (msg.sender.send(this.balance)){
        logString("funds returned to player 0");
      } else {throw;}
    } else if (msg.sender == players[1].addr &&
               deposits[0]<betSize) {
      if (msg.sender.send(this.balance)) {
        logString("funds returned to player 1");
      } else {throw;}
    }
  }

  /// function to put a card that has not been played in the middle
    function playACard(uint card)
      inRange(card)
      betsArePlaced
      onlyBefore(gameEndTime)
    {
      /*which player sent the card?*/
      uint pIdx;
      if (msg.sender == players[0].addr) {pIdx = 0;}
      else {
          if (msg.sender == players[1].addr) {pIdx = 1;}
          else { throw;}//player not part of the game
      }
      //check whether card is in legal 
      //(TODO: find out how to catch exceptions in tests)
      //AND whether the player has not played before
      if (players[pIdx].cards[card-1]) {
        if(middle[pIdx] == 0) {
          players[pIdx].cards[card-1] = false;
          middle[pIdx] = card;
          //fire events:
          logString("card Played!Now waiting 4:");
        } else { logString("middle is not empty");}
      } else { logString("card was already played!");}
      //both players have submitted a card?
      if (middle[0] != 0 && middle[1] != 0)
        {
          //slower player gets the waited time added on his clock
          clocks[pIdx] += now - waitingTime;
          //also cards are revealed
          reveal();
        }
      else
        {
          waiting4(players[1-1**pIdx].addr);
          //first player gets to reset the waiting time clock to now
          waitingTime = now;
        }
    }
    
    ///function to find out whose card is higher and assign points
    function reveal() internal{
      round += 1;
      //DRAW: no one gets a point, but next round is for one more
      //when the game ends with a draw, the score is a draw too
      //so both are paid out
      if ( middle[0] == middle[1] )
        {
          drawpot += 1;
          if (round == 5 ) {endGame(2);}
        }
      else //no draw -> determine winner
        {
          uint winneridx;
          if ( middle[0]>middle[1] ) {
              winneridx = 0;
          } else { winneridx = 1;}
          //alert players by firing event:
          cardsRevealed(middle[0], middle[1]); 
          // augment winners score:
          players[winneridx].points += 1 + drawpot;
          //and reset possible extrapoints
          drawpot = 0; 
          //check if one player has more than half of the cards
          //if so end the game
          if ( players[winneridx].points > 2 )
            {
              endGame(winneridx);
            }
        }
      //always reset middle
      middle = [0,0];
    }

    ///function to pay out the winner and suicide the contract
    function endGame(uint winner) internal
    {
      if (winner == 2) {payOutBoth();}
      else
        {
          gameEnded("game is Over and the winner is: ", winner);
          suicide(players[winner].addr);
        }
    }

    function payOutBoth() internal
    {
      logString("paying Out both!");
      if (!players[0].addr.send(deposits[0]) ) {
        logString("somehow paying out did not work.");
        throw;
      }
      else {suicide(players[1].addr);}
    }
         
    /// function to resolve an unfinished game:
    /// it pays out the player who reacted quicker (not his fault
    // that the game ended unresolved, if none played a card,
    // payout is split
    function resolveUnfinishedGame() 
    onlyAfter(gameEndTime)
    {
      uint wIdx ;
      if (clocks[0] == clocks[1])
        {
          //if no player could play a card, both are paid out
          if (middle[0] == middle[1]) { wIdx = 2;}
          else
            {
              //if one player plays no card at all, he also gets no
              //time on his clock, so then the one who has a card in
              //the middle wins (also catching the unlikely case that
              //somehow both players waited the exact amount of time)
              if (middle[0] > middle[1]) { wIdx = 0;} else {wIdx = 1;}
            }
        }
      else
        //find out who is having a smaller clock :D
        {
        if (clocks[0] < clocks[1] ) { wIdx = 0;} else {wIdx = 1;}
        }
      // pay him out and (destroy contract)
      endGame(wIdx);
    }

    //convenience functions 
  
    ///function to return current score
    function score() constant returns (uint[2] scores) {
        scores = [ players[0].points, players[1].points ];
    }
    
    ///function to a learn what cards are still in play
    function showCards(uint pIdx) constant returns (bool[5]){
      return players[pIdx].cards;
    }
}



