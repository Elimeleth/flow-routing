# Openai plugin for extension create bot

## Usage

```ts
import "dotenv/config"
import {
  createBot,
  createProvider,
  createFlow,
} from "@bot-whatsapp/bot";

import BaileysProvider from "@bot-whatsapp/provider/baileys";
import MockAdapter from "@bot-whatsapp/database/mock";

import vendedorFlow from './flows/vendedor.flow';
import expertoFlow from './flows/experto.flow';

import { FlowRouting } from '@builderbot-plugins/flow-routing';
/**
 * Configuracion de Plugin
 */

const agents = [
  {
    name: "EMPLEADO_VENDEDOR",
    description:
      "Soy Rob el vendedor amable encargado de atentender si tienes intencion de comprar o interesado en algun producto, mis respuestas son breves.",
    flow: vendedorFlow,
  },
  {
    name: "EMPLEADO_EXPERTO",
    description:
      "Saludos, mi nombre es Leifer.Soy el engargado especializado en resolver tus dudas sobre nuestro curso de chatbot, el cual está desarrollado con Node.js y JavaScript. Este curso está diseñado para facilitar la automatización de ventas en tu negocio. Te proporcionaré respuestas concisas y directas para maximizar tu entendimiento.",
    flow: expertoFlow,
  }
]


const routing = new FlowRouting(agents)

/**
 * 
 */


const main = async () => {
    const adapterDB = new MockAdapter();

    const welcomeFlow = addKeyword(EVENTS.WELCOME).addAction(null, async (ctx, { flowDynamic, gotoFlow }) => {
        const flow = await routing.determine(ctx.body)
        
        if (flow) {
            return gotoFlow(flow)
        }
        
        await flowDynamic('Ups!, parece que no logre entender lo que me decias.', { delay:  500 })
    })

    const adapterFlow = createFlow([
        welcomeFlow,
        vendedorFlow,
        expertoFlow
    ]);
  
  const adapterProvider = createProvider(BaileysProvider);

  const configBot = {
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  }

  await createBot(configBot);
};

main();
```

## Author

Elimeleth Capuano <https://github.com/elimeleth>
