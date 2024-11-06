<template>
    <div>
        <button v-if="PlayerCards.length == 0" @click="StartGame()">
            Start Game
        </button>
        <button v-if="PlayerCards.length > 0" @click="GetCard()">
            Geef extra Kaart
        </button>
        <button v-if="PlayerCards.length > 0" @click="Dealer()">
            Houd Kaarten/Dealer
        </button>
        <br/>
        Player:
        <table>
            <th v-for="PlayerCard in PlayerCards" :style="{width:'66px', height:'100px', border:'1px solid black'}">
                {{ PlayerCard.Card }}
                {{ PlayerCard.Symbol }}
            </th>
        </table>
        Player Score: {{ PlayerPoints }} <br/>
    <br/>
        Dealer:
        <table>
            <th v-for="DealerCard in DealerCards" :style="{width:'66px', height:'100px', border:'1px solid black'}">
                {{ DealerCard.Card }}
                {{ DealerCard.Symbol }}
            </th>
        </table>
        Dealer Score: {{ DealerPoints }} <br/>
        Winnaar: {{ Winnaar }}
    </div>
</template>

<script setup>
import { ref } from 'vue'

    let Suits = ['Spade', 'Hearts', 'Clubs', 'Diamonds'];
    let Symbols = ['♠', '♥', '♣', '♦']
    let Cards = ['Ace', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'Jack', 'Queen', 'King'];
    let Points = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    let Deck = ref([]);
    let PlayerCards = ref([])
    let DealerCards = ref([])
    let Winnaar = ref('')
    let PlayerPoints = ref(0)
    let DealerPoints = ref(0)
    let AllePuntenPlayer = ref([])
    let AllePuntenDealer = ref([])
    let PlayerAce = ref([0])
    let DealerAce = ref([0])

    function Playingcards(){
        for(let i = 0; i < Suits.length; i++){
            for(let x = 0; x < Cards.length; x++){
                let card = {Card: Cards[x], Suit: Suits[i], Points: Points[x], Symbol: Symbols[i]
                }
                Deck.value.push(card);
            }
        }
        return Deck.value
    }

    function StartGame(){
        Playingcards()
        GetCard()
        GetCard()
    }

    function GetCard(){
        PlayerCards.value[PlayerCards.value.length] = Deck.value.splice(Math.floor(Math.random()*Deck.value.length), 1)[0];
        PuntenBerekeningPlayer()
    }

    function PuntenBerekeningPlayer(){
        PlayerPoints.value = 0
        for(let i = 0; i < PlayerCards.value.length; i++){
            if (PlayerCards.value[i].Points < 11){
                AllePuntenPlayer.value[i] = PlayerCards.value[i].Points
            }
            if (PlayerCards.value[i].Points > 10){
                AllePuntenPlayer.value[i] = 0
                PlayerCards.value[i].Points = 0
                PlayerAce.value++                
            }
            PlayerPoints.value = PlayerPoints.value + AllePuntenPlayer.value[i]
        }
        if (PlayerAce.value > 0 && PlayerPoints.value + 10 + PlayerAce.value < 22){
            PlayerPoints.value = PlayerPoints.value + 10 + PlayerAce.value
        }
        else if (PlayerAce.value > 0 && PlayerPoints.value + 10 + PlayerAce.value > 21){
            PlayerPoints.value = PlayerPoints.value + PlayerAce.value
        }            
        
        if(PlayerPoints.value == 21 && PlayerCards.value.length == 2){
            Winnaar.value = 'Player'
            return window.alert("Je hebt Gewonnen!")
        }

        else if(PlayerPoints.value > 21){
            Winnaar.value = 'Dealer'
            return window.alert("Je hebt Verloren!")
        }
    }

    function Dealer(){
        DealerCard()        
    }

    function DealerCard(){
        DealerCards.value[DealerCards.value.length] = Deck.value.splice(Math.floor(Math.random()*Deck.value.length), 1)[0];
        PuntenBerekeningDealer()
    }


    function PuntenBerekeningDealer(){
        DealerPoints.value = 0
        for(let i = 0; i < DealerCards.value.length; i++){
            if (DealerCards.value[i].Points < 11){
                AllePuntenDealer.value[i] = DealerCards.value[i].Points
            }
            if (DealerCards.value[i].Points > 10){
                AllePuntenDealer.value[i] = 0
                DealerCards.value[i].Points = 0
                DealerAce.value++                
            }
            DealerPoints.value = DealerPoints.value + AllePuntenDealer.value[i]
        }
        if (DealerAce.value > 0 && DealerPoints.value + 10 + DealerAce.value < 22){
            DealerPoints.value = DealerPoints.value + 10 + DealerAce.value
        }
        else if (DealerAce.value > 0 && DealerPoints.value + 10 + DealerAce.value > 21){
            DealerPoints.value = DealerPoints.value + DealerAce.value
        } 
        if (DealerPoints.value > 21){
            Winnaar.value = 'Player'
            return window.alert("Je hebt gewonnen!")
        }
        else if (DealerPoints.value > PlayerPoints.value){
            Winnaar.value = 'Dealer'
            return window.alert("Je hebt Verloren!")
        }
        else if (DealerPoints.value <= PlayerPoints.value){
            DealerCard()
        }
    }

</script>