import amqp from 'amqplib'
import { env } from '../config/env.js'

let channel = null
const exchange = 'megebase.topic'

export const initRabbitMQ = async () => {
  const connection = await amqp.connect(env.RABBITMQ_URL)
  channel = await connection.createChannel()
  await channel.assertExchange(exchange, 'topic', { durable: true })
}

export const publishMessage = async (service, entity, action, data) => {
  if (!channel) throw new Error('RabbitMQ channel not initialized')
  const routingKey = `${service}.${entity}.${action}`
  const msgBuffer = Buffer.from(JSON.stringify(data || {}))
  channel.publish(exchange, routingKey, msgBuffer, { persistent: true })
}