const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const path = require('path')
const express = require('express');

const packageDefinitionOrder = protoLoader.loadSync(path.join(__dirname, '../protos/order.proto'));
const packageDefinitionPayment = protoLoader.loadSync(path.join(__dirname, '../protos/payment.proto'))

const orderProto = grpc.loadPackageDefinition(packageDefinitionOrder).order;
const paymentProto = grpc.loadPackageDefinition(packageDefinitionPayment).payment;


const orderClient = new orderProto.OrderService('0.0.0.0:50051', grpc.credentials.createInsecure())
const paymentClient = new paymentProto.PaymentService('0.0.0.0:50052', grpc.credentials.createInsecure())

const app = express()
app.use(express.json())


function createOrder(item, price) {
    return new Promise((res, rej) => {
        orderClient.CreateOrder({ item, price }, (err, data) => {
            if (err) rej(err)
            console.log(data, '----create order function response----')
            const { orderId, item, price } = data
            const paymentRequest = {
                order_id: orderId,
                item, 
                price
            }
            paymentClient.ProcessPayment(paymentRequest, (err, data) => {
                if (err) rej
                console.log(data, '--- payment success ---')
                res(data)
            })
        })
    })
}

function listOrder() {
    return new Promise((res, rej) => {
        orderClient.ListOrders({},(err,data) => {
            if(err) rej(err);
            res(data)
        }) 
    })
}


app.post('/order', async (req, res) => {
    const { item, price } = req.body;
    if (!item || !price) {
        return res.status(400).json('need item and price')
    }
    const data = await createOrder(item, price)
    res.status(200).json(data)
})

app.get('/order', async (req, res) => {
    const data = await listOrder()
    res.status(200).json(data)
})

app.listen(5000, () => {
    console.log('server is running on port 5000')
})

