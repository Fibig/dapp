<script setup>
const isMetaMaskInstalled = ref(false);
const accounts = ref([]);

const nikolaContractAddress = '0xc3992C6A6bD49C6326b220C48327051AC0AD23aB'

onMounted(() => {
    if (window.ethereum) {
        isMetaMaskInstalled.value = true;

        connectWallet();



        return
    }
});

function sendTransaction()    {
    window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
            {
                from: accounts.value[0],
                to: nikolaContractAddress,
            }
        ]
})
}

async function connectWallet() {
    accounts.value = await window.ethereum.request({ method: 'eth_requestAccounts' });
}
</script>

<template>
    <div>
        <div v-if="isMetaMaskInstalled">
            <p>Please Connect MetaMask</p>
            <button @click="sendTransaction">send Transaction</button>
            <div v-if="accounts">
                <p>Account: {{ accounts }}</p>
            </div>
        </div>
        <div v-else>
            <p>Please Install MetaMask</p>
        </div>
    </div>
</template>