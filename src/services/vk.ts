/* eslint-disable */
interface iVK {
  Auth: {
    login: (a:(data:object) => void, b:number) => void,
    logout: (a:() => void) => void,
  }
  Api: {
    call: (method:string, params:object, cb:(res:unknown) => void) => void,
  }
}

export interface VKResponse {
  response: {
    items: object[]
    count: number
  }
}

export interface VKError {
  error: {
    error_code: number
    error_msg: string
  }
}

declare const VK:iVK;

class VKApi {
  api = VK;

  login(opts:number = 0) {
    return new Promise<object>((res, rej) => {
      VK.Auth.login((data:object) => {
        res(data);
      }, opts);
    });
  }

  logout() {
    return new Promise<void>((res) => {
      VK.Auth.logout(() => {
        res();
      });
    });
  }

  call(method:string, params:object) {
    return new Promise<unknown>((res) => {
      VK.Api.call(method, params, (result) => {
        res(result);
      });
    });
  }
}

export default new VKApi();
