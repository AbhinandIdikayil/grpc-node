const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../protos/order.proto'));

const orderProto = grpc.loadPackageDefinition(packageDefinition).order;

const server = new grpc.Server();


const orders = [];


server.addService(orderProto.OrderService.service, {
    CreateOrder: (call, callback) => {
        const { item, price } = call.request;
        if (!item || !price) {
            return null
        }
        const orderId = Math.floor(Math.random() * 1000)
        orders.push({ orderId, item, price });
        const response = { orderId, item, price };
        callback(null, response);
    },
    ListOrders: (call, callback) => {
        if (orders.length > 0) {
            const response = {
                orders: orders.map(order => ({
                    orderId: order.orderId,
                    item: order.item,
                    price: order.price
                }))
            };
            callback(null, response)
        }
    }
})

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
})