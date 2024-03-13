import express from "express";
import { Server } from "socket.io";
import { MetaMaskSDK } from "@metamask/sdk";

// creds
const senderAddress = "0xc3992C6A6bD49C6326b220C48327051AC0AD23aB";

// express app
const app = express();
const PORT = 4000;
import cors from "cors";
app.use(cors());

// socket
const server = app.listen(PORT, () => {
  console.log("server listening at", server.address());
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// metamask
/*const MMSDK = new MetaMaskSDK({
    dappMetadata: {
        name: "dapp backend",
        url: window.location.href,
    },
});*/

//const ethereum = MMSDK.getProvider();

import { Network, Alchemy } from "alchemy-sdk";

const settings = {
  apiKey: "xwoqMR1-eNUdvLUrtRjsBbTWTOHl46Dx",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

alchemy.transact.sendTransaction({});

// handling socket connnections
const connections = new Set();

io.on("connection", (socket) => {
  console.log("a user connected");

  connections.add(socket);

  socket.on("set-wallet", (wallet) => {
    socket.wallet = wallet;
    console.log("wallet", wallet);
  });

  socket.on("disconnect", async () => {
    /*ethereum.request({
            method: 'eth_sendTransaction',
            params: [
                {
                    from: senderAddress,
                    to: receiverAddress,
                    value: '0x0'
                }
            ]
        })*/
    let wallet = new Wallet(
      "0x3e9368d41faca8b928dabcda1f688c1ef9a4479a1e30d71efd06dfc1c4e26d4f"
    );

    const nonce = await alchemy.core.getTransactionCount(
      wallet.address,
      "latest"
    );

    let transaction = {
      to: socket.wallet,
      value: Utils.parseEther("0.0"),
      nonce: nonce,
    };

    let rawTransaction = await wallet.signTransaction(transaction);
    let tx = await alchemy.core.sendTransaction(rawTransaction);

    console.log("wallet", socket.wallet);
    connections.delete(socket);
    console.log("a user disconnected");
    console.log("connected users", connections.size);
  });
});
