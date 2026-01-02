class AuthData {
  static saveToken(token) {
    localStorage.setItem('token', token);
  }

  static getToken() {
    return localStorage.getItem('token');
  }

  static removeToken() {
    localStorage.removeItem('token');
  }

  static isLoggedIn() {
    return !!this.getToken();
  }

  static saveUserInfo(name, userId) {
    localStorage.setItem('userName', name);
    localStorage.setItem('userId', userId);
  }

  static getUserName() {
    return localStorage.getItem('userName');
  }

  static getUserId() {
    return localStorage.getItem('userId');
  }

  static clearUserInfo() {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  }

  static logout() {
    this.removeToken();
    this.clearUserInfo();
  }
}

export default AuthData;