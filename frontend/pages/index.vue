<script setup>
// nix anzeigen
// schauen ob metamask installiert ist
// wenn ja, dann verbindung herstellen und adresse an socket senden
// wenn nein, dann bitte installieren
// wenn verbindung hergestellt, dann transaktion senden
// wenn transaktion erfolgreich, dann frontend herzeigen
// wenn verbindung getrennt, dann soll backend geld zurückgeben
import { io } from "socket.io-client";

const receiverAddress = '0xc3992C6A6bD49C6326b220C48327051AC0AD23aB'


// STATES
const isMetaMaskInstalled = ref(false);
const accounts = ref([]);
const state = reactive({
    connected: false,
    verified: false,
});

// SOCKET
const socketUrl = "http://localhost:4000";
const socket = io(socketUrl);

socket.on("connect", () => {
    state.connected = true;
});

// LIFE CYCLE
onMounted(() => {
    metaMaskConnect();
});

onBeforeUnmount(() => {
    disconnectSocket();
});

// METHODS
async function metaMaskConnect() {
    if (window.ethereum) {
        isMetaMaskInstalled.value = true;
        accounts.value = await window.ethereum.request({ method: 'eth_requestAccounts' });

        if (accounts.value.length === 0) {
            return;
        }

        socket.emit("setWallet", accounts.value[0]);

        buyVerification();
    }
}

function disconnectSocket() {
    socket.disconnect()
}

async function buyVerification() {
    const response = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
            {
                from: accounts.value[0],
                to: receiverAddress,
                value: '0x0'
            }
        ]
    })

    console.log(response)
}

</script>

<template>
    <div>
        <p v-if="!isMetaMaskInstalled">Please install MetaMask</p>
        <p v-if="accounts.length === 0">Please connect a wallet</p>
        <p v-if="state.connected">Connected</p>
        <p v-if="state.verified">Verified</p>
        <p v-else>Buy Verification</p>
    </div>
</template>