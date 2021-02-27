import { singleton, injectable } from "tsyringe";
import Twit from "twit";

@injectable()
@singleton()
export default class Client {
  private _twit: Twit;
  constructor() {}
}
