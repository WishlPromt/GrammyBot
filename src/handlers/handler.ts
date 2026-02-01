import { Composer } from "grammy";

export abstract class Handler {
    protected composer = new Composer()

    public getComposer() {
        return this.composer
    }
}