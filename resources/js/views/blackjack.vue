<template>
    <div>
        <div v-if="GameBoard == false">
            Aantal Players:<select v-model.number="AantalPlayers">
                <option disabled value="">Hoeveel Spelers</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
            </select>
            <button @click="StartGame()">
                Start Game
            </button>
        </div>

        <div v-if="GameBoard == true" >
        <br/>
            <table v-for="Player in AantalPlayers" :style="{visibility:GameBoard}">
                Player:{{Player}}<br/>
                Score: 
                <div v-if="PlayerPoints[Player-1] > 0">
                    {{ PlayerPoints[Player-1] }} 
                </div>
                <div v-else="">Defeat</div>
                <br/>
                <th v-for="PlayerCard in PlayersCards[Player-1]" :style="{width:'66px', height:'100px', border:'1px solid black'}">
                    {{ PlayerCard.Card }}
                    {{ PlayerCard.Symbol }}
                </th>
                <div v-if="Player == ActivePlayer+1 && PlayerHolds[ActivePlayer] == false" >                    
                    <button @click="GetCard()">
                        Geef extra Kaart
                    </button>
                    <button @click="HoldCard()">
                        Houd Kaarten
                    </button>
                </div>
                    <br/>
            </table>
            <br/>
            <div v-if="PlayerHolds.every(Boolean) ==  true">
                <table>
                    Dealer: <br/>
                    Dealer Score: {{ DealerPoints }} <br/>
                    <th v-for="DealerCard in PlayersCards[AantalPlayers]" :style="{width:'66px', height:'100px', border:'1px solid black'}">
                        {{ DealerCard.Card }}
                        {{ DealerCard.Symbol }}
                    </th>
                </table>
                Winnaar: {{ Winnaar }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

    let Suits = ['Spade', 'Hearts', 'Clubs', 'Diamonds'];
    let Symbols = ['♠', '♥', '♣', '♦']
    let Cards = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];
    let Points = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    let Deck = ref([]);
    let Winnaar = ref('')
    let PlayerPoints = ref([])
    let DealerPoints = ref(0)
    let AllePunten = ref([[],[],[],[],[]])
    let Aces = ref([[],[],[],[],[]])
    let AantalPlayers = ref(3)
    let PlayersCards = ref([[],[],[],[],[]])
    let PlayerHolds = ref([])
    let AantalKaarten = ref([])
    let GameBoard = ref(false)
    let ActivePlayer = ref(0)

    function HoldCard(){
        PlayerHolds.value[ActivePlayer.value] = true
        NextPlayer()
    }

    function NextPlayer(){
        ActivePlayer.value++
        if (ActivePlayer.value > AantalPlayers.value){
            ActivePlayer.value = 0
        }
        if(PlayerHolds.value[ActivePlayer.value] == true && PlayerHolds.value.every(Boolean) == false || PlayerHolds.value[ActivePlayer.value] == undefined ){
            NextPlayer()
        }
        else if(PlayerHolds.value.every(Boolean) ==  true ){
            PuntenBerekeningDealer()
        }
    }

    function Playingcards(){
        for(let i = 0; i < Suits.length; i++){
            for(let x = 0; x < Cards.length; x++){
                let card = {Card: Cards[x], Suit: Suits[i], Points: Points[x], Symbol: Symbols[i]
                }
                Deck.value.push(card);
            }
        }
        StartingHand()
        return Deck.value
    }

    function StartGame(){
        Playingcards()
    }

    function StartingHand(){
        for(let i = 0; i < AantalPlayers.value+1; i++){
            AantalKaarten.value[i] = 0
            PlayersCards.value[i][AantalKaarten.value[i]] = Deck.value.splice(Math.floor(Math.random()*Deck.value.length), 1)[0]
            AantalKaarten.value[i]++
            PlayersCards.value[i][AantalKaarten.value[i]] = Deck.value.splice(Math.floor(Math.random()*Deck.value.length), 1)[0]
            AantalKaarten.value[i]++
            if(i <= AantalPlayers.value-1){
                PlayerHolds.value[i] = false
            }
            PuntenBerekeningPlayer()
        }
        GameBoard.value = true
    }

    function GetCard(){
        PlayersCards.value[ActivePlayer.value][AantalKaarten.value[ActivePlayer.value]] = Deck.value.splice(Math.floor(Math.random()*Deck.value.length), 1)[0];
        AantalKaarten.value[ActivePlayer.value]++
        PuntenBerekeningPlayer()
    }

    function PuntenBerekeningPlayer(){
        PlayerPoints.value[ActivePlayer.value] = 0
        for(let i = 0; i < AantalKaarten.value[ActivePlayer.value]; i++){            
            if (PlayersCards.value[ActivePlayer.value][i].Points < 11){
                AllePunten.value[ActivePlayer.value][i] = PlayersCards.value[ActivePlayer.value][i].Points
            }
            if (PlayersCards.value[ActivePlayer.value][i].Points > 10){
                AllePunten.value[ActivePlayer.value][i] = 0
                PlayersCards.value[ActivePlayer.value][i].Points = 0
                Aces.value[ActivePlayer.value]++                
            }
            PlayerPoints.value[ActivePlayer.value] = PlayerPoints.value[ActivePlayer.value] + AllePunten.value[ActivePlayer.value][i]
        }

        if (Aces.value[ActivePlayer.value] > 0 && PlayerPoints.value[ActivePlayer.value] + 10 + Aces.value[ActivePlayer.value] < 22){
            PlayerPoints.value[ActivePlayer.value] = PlayerPoints.value[ActivePlayer.value] + 10 + Aces.value[ActivePlayer.value]
        }

        else if (Aces.value[ActivePlayer.value] > 0 && PlayerPoints.value[ActivePlayer.value] + 10 + Aces.value[ActivePlayer.value] > 21){
            PlayerPoints.value[ActivePlayer.value] = PlayerPoints.value[ActivePlayer.value] + Aces.value[ActivePlayer.value]
        }            
        
        if(PlayerPoints.value[ActivePlayer.value] > 21){
            PlayerPoints.value[ActivePlayer.value] = 0
            PlayerHolds.value[ActivePlayer.value] = true
            window.alert("Player "+(ActivePlayer.value+1)+" heeft Verloren!")
            return NextPlayer()
        }
        NextPlayer()
    }

    function DealerCard(){
        PlayersCards.value[AantalPlayers.value][AantalKaarten.value[AantalPlayers.value]] = Deck.value.splice(Math.floor(Math.random()*Deck.value.length), 1)[0];
        AantalKaarten.value[AantalPlayers.value]++
        PuntenBerekeningDealer()
    }
    
    
    function PuntenBerekeningDealer(){
        DealerPoints.value = 0
        for(let i = 0; i < AantalKaarten.value[AantalPlayers.value]; i++){            
            if (PlayersCards.value[AantalPlayers.value][i].Points < 11){
                AllePunten.value[AantalPlayers.value][i] = PlayersCards.value[AantalPlayers.value][i].Points
            }
            if (PlayersCards.value[AantalPlayers.value][i].Points > 10){
                AllePunten.value[AantalPlayers.value][i] = 0
                PlayersCards.value[AantalPlayers.value][i].Points = 0
                Aces.value[AantalPlayers.value]++                
            }
            DealerPoints.value = DealerPoints.value + AllePunten.value[AantalPlayers.value][i]
        }

        if (Aces.value[AantalPlayers.value] > 0 && DealerPoints.value + 10 + Aces.value[AantalPlayers.value] < 22){
            DealerPoints.value = DealerPoints.value + 10 + Aces.value[AantalPlayers.value]
        }
        else if (Aces.value[AantalPlayers.value] > 0 && DealerPoints.value + 10 + Aces.value[AantalPlayers.value] > 21){
            DealerPoints.value = DealerPoints.value + Aces.value[AantalPlayers.value]
        }            
                   
        if (DealerPoints.value < Math.max(...PlayerPoints.value)
        ){
           return DealerCard()
        }
        else return WinnaarCheck()
    }

    function WinnaarCheck(){
        if (DealerPoints.value > Math.max(...PlayerPoints.value)
        && DealerPoints.value < 22
        ){
            Winnaar.value = 'Dealer'
            return window.alert("De dealer heeft gewonnen!")
        }

        else if(PlayerPoints.value.filter((item, index) => PlayerPoints.value.indexOf(item) !== index) >= [Math.max(...PlayerPoints.value)]){
           Winnaar.value = 'Gelijk spel'
           return window.alert("Het is gelijkspel")
        }
            
        else if (DealerPoints.value > 21 
        && Math.max(...PlayerPoints.value) < 22){
            Winnaar.value = ("Player "+ (PlayerPoints.value.indexOf(Math.max(...PlayerPoints.value))+1))
            return window.alert("Player "+(PlayerPoints.value.indexOf(Math.max(...PlayerPoints.value))+1)+" heeft Gewonnen!")
        }
        
        else if (DealerPoints.value == Math.max(...PlayerPoints.value)){
            Winnaar.value = 'Gelijk spel'
            return window.alert("Het is gelijkspel")
        }
    }

</script>