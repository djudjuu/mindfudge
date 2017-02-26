pragma solidity ^0.4.8;
contract mindfudge  {
  /* This declares a new complex typce for a Player*/
  struct Player
  {
    address addr;
    bool[5] cards;
      uint points;
  }

  address owner;
  Player[2] players;
  uint[2] middle = [0,0];
  uint drawpot = 0;
  address mindfudger;
  /*later: 
  //uint amount
  //uint lenGame = 5;*/
  event waiting4(address slowDude);
  event cardsRevealed(uint card1, uint card2);
  event logString(string);
  event gameEnded(string text, uint winnerIdx);


  function mindfudge(address enemy)
  {
      owner = msg.sender;
      players[0] = Player({
              addr: owner,
                cards:[true, true, true ,true, true],
              points: 0
              });
      players[1] = Player({
              addr: enemy,
                cards:[true, true, true ,true, true],
              points: 0
              });              
  }

  //first prototype
   function dummyCard(uint card){
      if (msg.sender == players[0].addr)
        {
        middle[0] = card;
        logString("card played!");
        waiting4(players[1].addr);
        }
        else {
          middle[1] = card;
          logString("card played!");
          waiting4(players[0].addr);
        }
        /*both players have submitted a card?*/
        if (middle[0] != 0  && middle[1] != 0)
        {
        reveal();
        }
   }
       
  /*function to put a card that has not been played in the middle*/
    function playACard(uint card){
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
        if (players[pIdx].cards[card-1]==true) {
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
        reveal();
        }
      else
        {
          waiting4(players[1-1**pIdx].addr);
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
        }
      //*reset middle*/
      middle = [0,0];
    }

    //*function to declare the game ended/
    //later: payOut Winner*/
    function endGame(uint winner) internal
    {
      gameEnded("game is Over and the winner is: ", winner);
      mindfudger = players[winner].addr;
    //*end Game and payout everything to the Winner
    //suicide(mindfudger);*/
    }

    //convenience functions to learn, get Stats and debug workflow

    //*queryfunction to find out whether you won*/
    function didIWin() constant returns (bool won) {
        won = msg.sender == mindfudger;
        return won;
    } 

    //*function to return current score*/
    function score() constant returns (uint[2] scores) {
        scores = [ players[0].points, players[1].points ];
    }

    //*function to return both players*/
    function matchup() constant returns (address[2] scores) {
        scores = [ players[0].addr, players[1].addr ];
    }
    
    function getOwner() constant returns (address){
        return owner;
    }

    function whoAmI() constant returns (address){
        return msg.sender;
    }
    function getMiddle() constant returns (uint[2]){
      return middle;
    }

    function showCards(uint pIdx) constant returns (bool[5]){
      return players[pIdx].cards;
    }

}
