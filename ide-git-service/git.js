angular.module('ideGit', [])
    .provider('gitApi', function GitApiProvider() {
        this.gitServiceUrl = '/services/v4/ide/git';
        this.$get = ['$http', function gitApiFactory($http) {

            return {
            };
        }];
    });
