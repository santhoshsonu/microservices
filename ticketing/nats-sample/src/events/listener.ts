import { Message, Stan } from "node-nats-streaming";

/**
 * Wrapper for Nats Subscriber
 * constructor paramas
 * @param client: nats.Stan
 */
export abstract class Listener {
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;

  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
      .setDeliverAllAvailable();
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => {
      console.log(
        `Message Recevied: ${this.subject} / ${this.queueGroupName}`
      );

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });

  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string' ?
      JSON.parse(data)
      : JSON.parse(data.toString('utf-8'));
  }

}