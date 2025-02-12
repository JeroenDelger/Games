<template>
    <div>
        <button @click="coinflip()">
            flip
        </button>
        <div>
            {{coin[randomNR]}}
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    const coin = ['kop','munt']
    var randomNR = ref([0])

function coinflip(){
    randomNR.value = Math.floor((Math.random() * 2));
     console.log(randomNR.value)
}
</script>