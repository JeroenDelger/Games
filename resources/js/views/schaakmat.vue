<template>
    <div v-if="GameOn == false">
        <select v-model="TypeOfPlayer">
                <option disabled value="">AI of Player</option>
                <option value="0">AI</option>
                <option value="1">Player</option>
            </select>
        <button @click="StartGame()">Start</button>
    </div>
    <table v-if="GameOn == true">
        <tr v-for="row in 10">
            <td v-for="cell in 10">
                <div v-if="(row % 2 == 0 && cell % 2 != 0) || (row % 2 != 0 && cell % 2 == 0)" :style="{width: '50px', height: '50px', border: '1px solid black', background:'grey'}">

                </div>
                <div v-else :style="{width: '50px', height: '50px', border: '1px solid black'}" >
                    
                </div> 
            </td>
        </tr>
    </table>

</template>

<script setup>
    import {ref } from "vue";

    let GameOn = ref(false);
    let TypeOfPlayer = ref();

    function StartGame(){
        GameOn.value = true
        console.log(TypeOfPlayer.value)
    }

</script>