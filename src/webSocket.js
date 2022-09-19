import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import url from "url";
import models from "./models/index.js";
import chatController from "./modules/chat/controllers/chatController.js";

const port = process.env.PORT || 4000;

var wssClients = [];

const initWebSocket = (server) => {
    const wss = new WebSocketServer({ path: "/api/v1/ws", noServer: true });

    console.log(`[webSocket]: running on port: ${port}`);

    server.on("upgrade", (request, socket, head) => {

        if (request.headers['upgrade'] !== 'websocket') {
            socket.end('HTTP/1.1 400 Bad Request');
            return;
        }

        let parsedUrl = url.parse(request.url, true, true);
        const pathname = parsedUrl.pathname;

        if (pathname === "/api/v1/ws") {
            wss.handleUpgrade(request, socket, head, (ws) => {
                wss.emit("connection", ws, request);
            });
        } else {
            socket.destroy();
        }
    });

    wss.on("connection", async (ws, req, client) => {
        ws.isAlive = true;
        ws.on("pong", () => {
            ws.isAlive = true;
        });

        let token = url.parse(req.url, true).query.token;

        if (!token) {
            ws.send(
                JSON.stringify({
                    success: false,
                    message: "token not provided",
                })
            );
            ws.close();
        } else {
            try {
                let decoded = jwt.verify(token, process.env.JWT_SECRET);
                ws.userId = decoded.id;
                ws.token = token;

                const isConnectionExist = wssClients.find(
                    (client) => client.userId === ws.userId
                );

                if (isConnectionExist) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            message: "connection already exist",
                        })
                    );
                    ws.close();
                    console.log("connection already exist");
                } else {
                    wssClients.push(ws);
                    ws.send(
                        JSON.stringify({
                            success: true,
                            message: `connection established`,
                        })
                    );
                    console.log(`[websocket]: user ${decoded.id} connected`);
                }
                console.log(`[websocket]: ${wssClients.length} clients connected`);
                // for (let i = 0; i < wssClients.length; i++) {
                //     const clients = [];
                //     clients.push(wssClients[i].userId);
                //     console.log(clients);
                // }
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        message: "invalid token",
                    })
                );
                ws.close();
            }
        }

        ws.on("message", async (message) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    client.send(
                        JSON.stringify({
                            success: false,
                            message: "invalid token",
                        })
                    );
                    client.close();
                } else {
                    chatController(ws, message, wssClients);
                }
            });
        });

        ws.on("close", async () => {
            const user = await models.User.findById(ws.userId)
                .select("_id lastActive ");
            wssClients = wssClients.filter((client) => client.userId !== ws.userId);
            console.log(`[websocket]: user ${ws.userId} disconnected`);
            console.log(`[websocket]: ${wssClients.length} clients connected`);

            if (user) {
                user.lastActive = Date.now();
                await user.save();
            }

            // for (let i = 0; i < wssClients.length; i++) {
            //     const clients = [];
            //     clients.push(wssClients[i].userId);
            //     console.log(clients);
            // }
        });
    });

    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) return ws.terminate();

            ws.isAlive = false;
            ws.ping();
        });
    }, 10000);

    wss.on("close", () => {
        clearInterval(interval);
        console.log("client disconnected");
    });

    return wss;
};

export default initWebSocket;
