/*
 * Copyright 2015 - 2017 Anton Tananaev (anton@traccar.org)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

Ext.define('Traccar.view.dialog.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    requires: [
        'Traccar.view.dialog.Register'
    ],

    init: function () {
        this.lookupReference('registerButton').setDisabled(
            !Traccar.app.getServer().get('registration'));
        this.lookupReference('languageField').setValue(Locale.language);
        this.initFirebase();
    },

    login: function () {
        console.log("login called");
        var form = this.lookupReference('form');
        if (form.isValid()) {
            Ext.get('spinner').setVisible(true);
            this.getView().setVisible(false);
            Ext.Ajax.request({
                scope: this,
                method: 'POST',
                url: 'api/session',
                params: form.getValues(),
                callback: function (options, success, response) {
                    var user, password;
                    Ext.get('spinner').setVisible(false);
                    if (success) {
                        if (this.lookupReference('rememberField').getValue()) {
                            user = Ext.util.Base64.encode(this.lookupReference('userField').getValue());
                            password = Ext.util.Base64.encode(this.lookupReference('passwordField').getValue());
                            Ext.util.Cookies.set('user', user, Ext.Date.add(new Date(), Ext.Date.YEAR, 1));
                            Ext.util.Cookies.set('password', password, Ext.Date.add(new Date(), Ext.Date.YEAR, 1));
                        }
                        Traccar.app.setUser(Ext.decode(response.responseText));
                        this.fireViewEvent('login');
                    } else {
                        this.getView().setVisible(true);
                        if (response.status === 401) {
                            Traccar.app.showError(Strings.loginFailed);
                        } else {
                            Traccar.app.showError(response.responseText);
                        }
                    }
                }
            });
        }
    },

    logout: function () {
        console.log("logout called");
        Ext.util.Cookies.clear('user');
        Ext.util.Cookies.clear('password');
        Ext.Ajax.request({
            scope: this,
            method: 'DELETE',
            url: 'api/session',
            callback: function () {
                window.location.reload();
            }
        });
    },

    onSelectLanguage: function (selected) {
        var paramName, paramValue, url, prefix, suffix;
        paramName = 'locale';
        paramValue = selected.getValue();
        url = window.location.href;
        if (url.indexOf(paramName + '=') >= 0) {
            prefix = url.substring(0, url.indexOf(paramName));
            suffix = url.substring(url.indexOf(paramName));
            suffix = suffix.substring(suffix.indexOf('=') + 1);
            suffix = suffix.indexOf('&') >= 0 ? suffix.substring(suffix.indexOf('&')) : '';
            url = prefix + paramName + '=' + paramValue + suffix;
        } else if (url.indexOf('?') < 0) {
            url += '?' + paramName + '=' + paramValue;
        } else {
            url += '&' + paramName + '=' + paramValue;
        }
        window.location.href = url;
    },

    onAfterRender: function (field) {
        field.focus();
    },

    onSpecialKey: function (field, e) {
        if (e.getKey() === e.ENTER) {
            this.login();
        }
    },

    onLoginClick: function () {
        Ext.getElementById('submitButton').click();
        // this.login();
        var form = this.lookupReference('form');
        if (form.isValid()) {
          this.loginFirebase(form.getValues());
        }
    },

    onRegisterClick: function () {
        Ext.create('Traccar.view.dialog.Register').show();
    },

    initFirebase: function () {
      var loginCallback = this.login;
      var logoutCallback = this.logout;
      var logoutFunction = this.firebaseLogout;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var uid = user.uid;
          var phoneNumber = user.phoneNumber;
          var providerData = user.providerData;
          user.getIdToken().then(function(accessToken) {
            document.getElementById('sign-in-status').textContent = 'Signed in';
            document.getElementById('sign-in').textContent = 'Sign out';
            document.getElementById('sign-in').addEventListener('click', function() {
              logoutFunction(logoutCallback);
            });
            document.getElementById('account-details').textContent = JSON.stringify({
              displayName: displayName,
              email: email,
              emailVerified: emailVerified,
              phoneNumber: phoneNumber,
              photoURL: photoURL,
              uid: uid,
              accessToken: accessToken,
              providerData: providerData
            }, null, '  ');
          console.log("login callback called");
          loginCallback();
          });
        } else {
          // User is signed out.
          document.getElementById('sign-in-status').textContent = 'Signed out';
          document.getElementById('sign-in').textContent = 'Sign in';
          // document.getElementById('sign-in').addEventListener('click', function() {
          //     ui.start('#firebaseui-auth-container', uiConfig);
          //   });
          document.getElementById('account-details').textContent = 'null';
        }
      }, function(error) {
        console.log(error);
      });
    },

    loginFirebase: function (formData) {
      firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch(function(error) {
        // Handle Errors here.
        console.log(error.code);
        console.log(error.message);
        // ...
      });
    },

    firebaseLogout: function (logoutCallback) {
      firebase.auth().signOut().then(function() {
        logoutCallback();
      }).catch(function(error) {
        console.log(error.code);
        console.log(error.message);
      });
    }
});
