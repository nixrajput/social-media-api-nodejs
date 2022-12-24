import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import url from "url";
import wsController from "./websocket/wsController.js";
import models from "./models/index.js";

const port = process.env.PORT || 4000;

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

    var wssClients = [];

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
                    type: 'error',
                    message: "token not provided",
                })
            );
            ws.close();
        } else {
            try {
                let decoded = jwt.verify(token, process.env.JWT_SECRET);
                ws.userId = decoded.id;
                ws.token = token;

                const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
                ws.ip = ip;

                const isConnectionExist = wssClients.find(
                    (client) => client.userId === ws.userId
                );

                if (isConnectionExist) {
                    ws.send(
                        JSON.stringify({
                            success: false,
                            type: 'connection',
                            message: "connection already exist",
                        })
                    );
                    ws.close();
                    console.log("connection already exist");
                } else {
                    wssClients.push(ws);

                    let currentUser = await models.User.findById(ws.userId)
                        .select("showOnlineStatus");

                    if (currentUser.showOnlineStatus === true) {
                        wssClients.forEach(async (client) => {
                            let user = await models.User.findById(client.userId)
                                .select("showOnlineStatus");

                            if (client !== ws && client.readyState === WebSocket.OPEN && user.showOnlineStatus === true) {
                                client.send(
                                    JSON.stringify({
                                        success: true,
                                        type: 'onlineStatus',
                                        message: "user online",
                                        data: {
                                            userId: ws.userId,
                                            status: "online",
                                        },
                                    })
                                );
                            }
                        });
                    }

                    ws.send(
                        JSON.stringify({
                            success: true,
                            type: 'connection',
                            message: `connection established`,
                        })
                    );
                    console.log(`[websocket]: user ${decoded.id} connected from ${ip}`);
                }

                console.log(`[websocket]: ${wssClients.length} clients connected`);
            } catch (err) {
                ws.send(
                    JSON.stringify({
                        success: false,
                        type: 'error',
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
                            type: 'error',
                            message: "invalid token",
                        })
                    );
                    client.close();
                } else {
                    wsController(ws, message, wssClients, req);
                }
            });
        });

        ws.on("close", async () => {
            const userId = ws.userId;

            if (userId) {
                wssClients = wssClients.filter((client) => client.userId !== userId);

                let currentUser = await models.User.findById(userId)
                    .select("showOnlineStatus lastSeen");

                currentUser.lastSeen = Date.now();
                await currentUser.save();

                if (currentUser.showOnlineStatus === true) {
                    wssClients.forEach(async (client) => {
                        if (client !== ws && client.readyState === WebSocket.OPEN) {
                            client.send(
                                JSON.stringify({
                                    success: true,
                                    type: 'onlineStatus',
                                    message: "user offline",
                                    data: {
                                        userId: userId,
                                        status: "offline",
                                        lastSeen: new Date(),
                                    },
                                })
                            );
                        }
                    });
                }

                wssClients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(
                            JSON.stringify({
                                success: true,
                                type: 'messageTyping',
                                message: "user stopped typing",
                                data: {
                                    senderId: ws.userId,
                                    status: 'end'
                                }
                            })
                        );
                    }
                });

                console.log(`[websocket]: user ${ws.userId} disconnected`);
                console.log(`[websocket]: ${wssClients.length} clients connected`);
            }
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
        wssClients = [];
        console.log("client disconnected");
    });

    return wss;
};

export default initWebSocket;
