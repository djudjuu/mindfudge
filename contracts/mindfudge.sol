pragma solidity ^0.4.8;
contract mindfudge  {
  /* This declares a new complex type for a Player*/
  struct Player
  {
    address addr;
    bool[5] cards;
    uint playeridx;
    uint wins;
  }
  Player[2] players;
  uint[] middle = [0,0];
  uint drawpot = 0;
  address mindfudger;
  /*later: 
  //uint amount
  //uint lenGame = 5;*/
    
  function mindfudge(address enemy)
  {
      players[0] = Player({
              addr: msg.sender,
              playeridx:0,
              cards:[true, true, true ,true, true],
              wins: 0
              });
      players[1] = Player({
              addr: enemy,
              playeridx:1,
              cards:[true, true, true ,true, true],
              wins: 0
              });              
  }

  /*function to put a card that has not been played in the middle*/
    function playACard(uint card){
      /*which player sent the card?*/
      Player memory active;
      if (msg.sender == players[0].addr)
        {
        active = players[0];
        }
      if (msg.sender == players[1].addr)
        {
        active = players[1];
        } else { throw;} /*only the two players can play
      //check whether the card has not been played  before AND
      // whether the player has not played in this round before*/
      if (active.cards[card] && middle[active.playeridx] == 0)
        {
          active.cards[card] = false;
          middle[0] = card;
        }
      /*both players have submitted a card?*/
      if (middle[0] != 0 && middle[1] !=0)
        {
        reveal();
        }
    }

    /*find out whos card is higher and assign wins*/
    function reveal() internal{
      /*DRAW: no one gets a point, but next round is for one more*/
      if ( middle[0] == middle[1] ) {
            drawpot += 1;
      }
      uint winneridx;
      /*player1 wins*/
      if ( middle[0]>middle[1] )
        {
        winneridx = 0;
        } else {
        winneridx = 1;
      }
      /* augment winners score*/
      players[winneridx].wins += 1 + drawpot;
      /*and reset possible extrapoints*/
      drawpot = 0;
      
      //*check if one player has more than half of the cards*/
      if ( players[winneridx].wins > 2 )
        {
        endGame(winneridx);
        }
      //*reset middle*/
      middle = [0,0];
    }

    //*function to declare the game ended
    //later: payOut Winner*/
    function endGame(uint winner) internal
    {
      mindfudger = players[winner].addr;
    //*end Game and payout everything to the Winner
    //suicide(mindfudger);*/
    }

    //*queryfunction to find out whether you won*/
    function didIWin() returns (bool won) {
        won = msg.sender == mindfudger;
        return won;
    } 

    //*function to return current score*/
    function score() returns (uint[2] scores) {
        scores = [ players[0].wins, players[1].wins ];
    }
    
    function owner() returns (address){
        return players[0].addr;
    }
    function matchup() returns (address[2]){
      return [players[0].addr, players[1].addr];
    }
      
}
