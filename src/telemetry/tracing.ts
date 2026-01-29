import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { env } from "../config/env";


const sdk = new NodeSDK({
    serviceName:env.serviceName,
    instrumentations: [getNodeAutoInstrumentations()]
});

sdk.start();

process.on("SIGTERM",async ()=>{
    await sdk.shutdown();
});