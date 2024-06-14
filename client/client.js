const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const path = require('path')
const express = require('express');

const packageDefinitionOrder = protoLoader.loadSync(path.join(__dirname,'../protos/order.proto'));
const packageDefinitionPayment = protoLoader.loadSync(path.join(__dirname,'../protos/payment.proto'))

const orderProto = grpc.loadPackageDefinition(packageDefinitionOrder).order;
const paymentProto = grpc.loadPackageDefinition(packageDefinitionPayment).payment;

const app = express()

app.listen(5000,() => {
    console.log('server is running on port 5000')
})

