import { injectable, singleton } from "tsyringe";
import { ApiClient } from "twitch";
import { RefreshableAuthProvider, StaticAuthProvider } from "twitch-auth";
import config from "../config.json";
import * as fs from "fs";
interface AuthType {
  readonly clientId: string;
  readonly clientSecret: string;
  accessToken: string;
  refreshToken: string;
}

@injectable()
@singleton()
export default class TwitchAPIClient {
  private _config: AuthType;
  private _authProvider: RefreshableAuthProvider;
  private _apiClient: ApiClient;

  constructor() {
    this._config = <AuthType>config;
    const clientSecret: string = this._config.clientSecret;
    const refreshToken: string = this._config.refreshToken;
    this._authProvider = new RefreshableAuthProvider(
      new StaticAuthProvider(this._config.clientId, this._config.accessToken),
      {
        clientSecret,
        refreshToken,
        onRefresh: (token): void => {
          this._config.accessToken = token.accessToken;
          this._config.refreshToken = token.refreshToken;
          fs.writeFileSync("./config.json", JSON.stringify(this._config));
        },
      }
    );
    this._apiClient = new ApiClient({ ...this._authProvider });
  }

  get apiClient() {
    return this._apiClient;
  }

  get authProvider() {
    return this._authProvider;
  }
}
