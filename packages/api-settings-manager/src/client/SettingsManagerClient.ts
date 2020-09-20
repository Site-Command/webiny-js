import { Action } from "../types";
import { HandlerClientContext } from "@webiny/handler-client/types";
import { HandlerContext } from "@webiny/handler/types";

interface SettingsManagerOperation {
    action: Action;
    key: string;
    data?: { [key: string]: any };
}

class SettingsManagerClientCache {
    data?: { [key: string]: any };
    constructor() {
        this.data = {};
    }

    set(key, data) {
        this.data[key] = data;
    }

    get(key) {
        return this.data[key];
    }

    flush(key) {
        delete this.data[key];
    }
}

export class SettingsManagerClient {
    settingsManagerFunction: string;
    cache: SettingsManagerClientCache;
    context: HandlerContext & HandlerClientContext;
    constructor({ context, functionName }) {
        this.settingsManagerFunction = functionName;
        this.cache = new SettingsManagerClientCache();
        this.context = context;
    }

    private async invoke(operation: SettingsManagerOperation) {
        const cached = this.cache.get(operation.key);
        if (cached) {
            return cached;
        }

        const { error, data } = await this.context.handlerClient.invoke({
            name: this.settingsManagerFunction,
            payload: operation
        })

        if (error) {
            throw Error(error);
        }

        this.cache.set(operation.key, data);

        return data;
    }

    async getSettings(key: string) {
        return await this.invoke({ action: "getSettings", key });
    }

    async saveSettings(key: string, data) {
        await this.invoke({ action: "saveSettings", key, data });
    }

    async deleteSettings(key: string) {
        await this.invoke({ action: "deleteSettings", key });
    }

    getCache() {
        return this.cache;
    }
}
