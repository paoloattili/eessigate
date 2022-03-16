import { HttpParams } from "@angular/common/http";
import { environment } from './../../environments/environment';

export class HttpClientRequest {
    private _baseURL: string;
    private _path: string;
    private _params: HttpParams = new HttpParams();

    private constructor(baseURL: string, path?: string) {
        this._baseURL = baseURL;
        this._path = path;
    }

    public static build(): HttpClientRequest {
        return new HttpClientRequest(environment.baseURL);
    }

    public static toPath(path: string): HttpClientRequest {
        return new HttpClientRequest(environment.baseURL, path);
    }

    public path(path: string): HttpClientRequest {
        this._path = path;
        return this;
    }

    public addParam(name: string, value: string): HttpClientRequest {
        this._params.append(name, value);
        return this;
    }

    public getParams(): HttpParams {
        return this._params;
    }

    public getURI(): string {
        return this._baseURL + this._path;
    }
}
