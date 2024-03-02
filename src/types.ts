import { BaseChatModel } from "@langchain/core/language_models/chat_models"
import { PromptTemplate } from "@langchain/core/prompts"

export type Agent = {
    name: string,
    description: string,
    flow: any
}

export declare class FlowRouting {
    agents: Agent[];
    prompt: PromptTemplate;
    model: BaseChatModel;

    constructor(agents: Agent[], options?: {
        model: BaseChatModel
    })

    determine(question: string): Promise<any>;
}