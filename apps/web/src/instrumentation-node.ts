import { bot } from "./services/bot/bots/adapix/adapix.agent";

export async function register() {
  await bot.start()
}