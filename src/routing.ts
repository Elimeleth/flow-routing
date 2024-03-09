import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { FreeGPT } from "@builderbot-plugins/free-gpt";

import { Agent } from "./types";
import { PROMPT } from "./prompt";


export default class FlowRouting {
    agents: Agent[]
    prompt: PromptTemplate = PromptTemplate.fromTemplate(PROMPT)

    constructor(agents: Agent[], private options?: {
        model: BaseChatModel
    }) {
        this.agents = agents

        if (!options?.model) {
            console.warn('[FREE GPT WARNING]: No model provided, defaulting to GPT-4 Turbo this model is an experimental model which not provide guaranteed results');
        }
    }
    async determine(question: string){
        const chain = RunnableSequence.from([
            this.prompt,
            this.options?.model || new FreeGPT('GPT-4 Turbo') as unknown as BaseChatModel,
            new StringOutputParser(),
        ]);

        const agent_name = await chain.invoke({
            agents: JSON.stringify(this.agents),
            question
        })
        
        return this.findEmployee(agent_name)
    }

    private findEmployee(name: string){
        return this.agents.find(
            agent => agent.name === name.replace(/\W+/gim, '').trim());
    }

}