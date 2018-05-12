import { constant, forEach } from 'lodash';
import { IService } from 'restangular';

class AuthService {
  private currentUser: any;
  private signInListeners: { [key: string]: (isSignIn: boolean) => void };
  private authInstance: gapi.auth2.GoogleAuth;
  private isSignedIn: boolean;
  private user: gapi.auth2.BasicProfile;
  private userId: string;

  private loadAuthPromise: Promise<void>;
  private authInstancePromise: Promise<boolean>;

  constructor(private restangular: IService) {
    this.currentUser = {};

    this.checkSignedIn().then((isSignedIn) => {
      this.onAuthChange(isSignedIn);
    });

    this.signInListeners = {};
  }

  // Returns promise that checks that gapi exists.
  public async loadApi(): Promise<void> {
    if (!this.loadAuthPromise) {
      this.loadAuthPromise = new Promise((resolve, reject) => {
        // Check gapi hasn't been blocked from loading
        if ((window as any).gapi) {
          gapi.load('auth2', () => resolve());
        } else {
          reject('GapiNotLoaded');
        }
      });
    }
    return this.loadAuthPromise;
  }

  public async checkSignedIn(): Promise<boolean> {
    return this.loadAuthInstance().then(() => this.authInstance.isSignedIn.get())
      .catch(constant(false));
  }

  public async getCurrentUserId(): Promise<string> {
    const isSignedIn = await this.checkSignedIn();
    return (isSignedIn) ? this.userId : '-1';
  }

  public getUserInfo(): gapi.auth2.BasicProfile {
    return this.user;
  }

  public getUserEmail(): string {
    return this.user ? this.user.getEmail() : '';
  }

  public renderSignInButton(buttonId: string) {
    if (!(window as any).gapi) {
      return;
    }
    gapi.signin2.render(buttonId, {});
  }

  public async signOut(): Promise<void> {
    await gapi.auth2.getAuthInstance().signOut();
    this.user = undefined;
    this.userId = undefined;
  }

  public addOnSignIn(key: string, func: (isSignIn: boolean) => void) {
    this.signInListeners[key] = func;
  }

  public removeOnSignIn(key: string) {
    delete this.signInListeners[key];
  }

  public async checkIsAdmin(): Promise<boolean> {
    const response = await this.restangular.one('admin')
      .customGET('', { userId: this.userId });
    return response.data.isAdmin;
  }

  /* private methods */

  private async loadAuthInstance(): Promise<boolean> {
    if (!this.authInstancePromise) {
      this.authInstancePromise = this.loadApi().then(() => {
        return new Promise<boolean>((resolve, reject) => {
          // auth2.init() returns a GoogleAuth instance. gapi.auth2 is also a GoogleAuth instance
          // GoogleAuth.then() is a custom defined function. Takes onInit() and onError() as args.
          // Do not chain this .then() It is not a normal .then() Will result in an infinte loop
          gapi.auth2.init({
            client_id: '728044119950-mpcea0183l7c87lflutdide1vfdmvjrb.apps.googleusercontent.com',
          }).then((authInstance) => {
            // authInstance is a GoogleAuth instance
            // NEVER RESOLVE A PROMISE WITH authInstance. EVERYTHING WILL BREAK.
            this.authInstance = authInstance;
            this.authInstance.isSignedIn.listen(this.onAuthChange.bind(this));
            resolve(true);
          }, () => reject('Auth2 initialisation error'));
        });
      });
    }
    return this.authInstancePromise;
  }

  private onAuthChange(isSignIn: boolean) {
    this.isSignedIn = isSignIn;
    if (isSignIn) {
      const googleUser = this.authInstance.currentUser.get();
      this.user = googleUser.getBasicProfile();
      this.userId = googleUser.getAuthResponse().id_token;
    }

    forEach(this.signInListeners, (listener) => {
      listener(isSignIn);
    });
  }
}

AuthService.$inject = ['Restangular'];

export default AuthService;
