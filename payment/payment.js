const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');


const packageDefinition = protoLoader.loadSync(path.join(__dirname, '../protos/payment.proto'))

const paymentProto = grpc.loadPackageDefinition(packageDefinition).payment


const server = new grpc.Server();

server.addService(paymentProto.PaymentService.service, {
    ProcessPayment: (call, callback) => { 
        const {order_id , price} = call.request;
        const success = true;
        const message = 'payment successfull'
        callback(null , {success , message})
    }
})

server.bindAsync('0.0.0.0:50052',grpc.ServerCredentials.createInsecure(),() => {
    server.start();
})