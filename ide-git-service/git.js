angular.module('ideGit', [])
    .provider('gitApi', function GitApiProvider() {
        this.gitServiceUrl = '/services/v4/ide/git';
        this.$get = ['$http', function gitApiFactory($http) {
            function getErrorMessage(error) {
                if (error)
                    return JSON.parse(response.data.error).message;
                else return 'Check console for more information.';
            }

            let listProjects = function (resourcePath) {
                if (resourcePath !== undefined && !(typeof resourcePath === 'string'))
                    throw Error("listProjects: resourcePath must be an string path");
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(resourcePath.split('/')).build();
                return $http.get(url, { headers: { describe: 'application/json' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let cloneRepository = function (workspace, repository, branch = '', username, password) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path('clone').build();
                return $http.post(url, {
                    repository: repository,
                    branch: branch,
                    publish: true,
                    username: username,
                    password: btoa(password),
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let pullRepository = function (workspace, project, branch = '', username, password) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(project).path('pull').build();
                return $http.post(url, {
                    publish: true,
                    username: username,
                    password: btoa(password),
                    branch: branch,
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            // This has to be implemented in the back-end. See issue #1984
            let pullRepositories = async function (workspace, projects, username, password, callback) {
                let response = { status: 200, message: '' };
                for (let i = 0; i < projects.length; i++) {
                    await pullRepository(workspace, projects[i], '', username, password).then(function (resp) {
                        response.status = resp.status;
                        if (response.status !== 200) response.message = resp.message;
                    });
                    if (response.status !== 200) break;
                }
                callback(response);
            }.bind(this);

            let pushRepository = function (workspace, project, branch = '', username, email, password) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(project).path('push').build();
                return $http.post(url, {
                    username: username,
                    password: btoa(password),
                    email: email,
                    branch: branch,
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let pushAllRepositories = function (workspace, username, email, password, autoAdd = false, autoCommit = false) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path('push').build();
                return $http.post(url, {
                    username: username,
                    password: btoa(password),
                    email: email,
                    autoAdd: autoAdd,
                    autoCommit: autoCommit,
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let resetRepository = function (workspace, project) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(project).path('reset').build();
                return $http.post(url, {}).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let importProjects = function (workspace, repository) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(repository).path('import').build();
                return $http.post(url, {}).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let deleteRepository = function (workspace, repositoryName, unpublish) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(repositoryName).path("delete").build();
                return $http.delete(`${url}?unpublish=${unpublish}`)
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Workspace service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let shareProject = function (
                workspace,
                project,
                repository,
                branch,
                commitMessage,
                username,
                password,
                email,
                shareInRootFolder,
            ) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(project).path('share').build();
                return $http.post(url, {
                    project: project,
                    repository: repository,
                    branch: branch,
                    commitMessage: commitMessage,
                    username: username,
                    password: btoa(password),
                    email: email,
                    shareInRootFolder: shareInRootFolder,
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let checkoutBranch = function (workspace, project, branch, username, password) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(project).path('checkout').build();
                return $http.post(url, {
                    project: project,
                    branch: branch,
                    username: username,
                    password: btoa(password),
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let commit = function (
                workspace,
                project,
                commitMessage,
                username,
                password,
                email,
                branch,
            ) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(project).path('commit').build();
                return $http.post(url, {
                    commitMessage: commitMessage,
                    username: username,
                    password: btoa(password),
                    email: email,
                    branch: branch,
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let push = function (
                workspace,
                project,
                commitMessage,
                username,
                password,
                email,
                branch,
            ) {
                let url = new UriBuilder().path(this.gitServiceUrl.split('/')).path(workspace).path(project).path('push').build();
                return $http.post(url, {
                    commitMessage: commitMessage,
                    username: username,
                    password: btoa(password),
                    email: email,
                    branch: branch,
                    autoAdd: false,
                    autoCommit: false,
                }).then(function successCallback(response) {
                    return { status: response.status, data: response.data };
                }, function errorCallback(response) {
                    console.error('Git service:', response);
                    return { status: response.status, message: getErrorMessage(response.data.error) };
                });
            }.bind(this);

            let branches = function (workspace, project, local = true) {
                let branchType = 'local';
                if (!local) branchType = 'remote';
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('branches')
                    .path(branchType)
                    .build();
                return $http.get(url, { headers: { describe: 'application/json' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let getUnstagedFiles = function (workspace, project) {
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('unstaged')
                    .build();
                return $http.get(url, { headers: { describe: 'application/json' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data.files };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let getStagedFiles = function (workspace, project) {
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('staged')
                    .build();
                return $http.get(url, { headers: { describe: 'application/json' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data.files };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let getOriginUrls = function (workspace, project) {
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('origin-urls')
                    .build();
                return $http.get(url, { headers: { describe: 'application/json' } })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let setFetchUrl = function (workspace, project, fetchUrl) {
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('fetch-urls')
                    .build();
                return $http.post(url, { url: fetchUrl })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let setPushUrl = function (workspace, project, pushUrl) {
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('push-urls')
                    .build();
                return $http.post(url, { url: pushUrl })
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let addToIndex = function (workspace, project, files) {
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('add')
                    .build();
                return $http.post(url, JSON.stringify(files.join(',')))
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let revertFiles = function (workspace, project, files) {
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('revert')
                    .build();
                return $http.post(url, JSON.stringify(files.join(',')))
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            let removeFiles = function (workspace, project, files) {
                let url = new UriBuilder()
                    .path(this.gitServiceUrl.split('/'))
                    .path(workspace)
                    .path(project)
                    .path('remove')
                    .build();
                return $http.post(url, JSON.stringify(files.join(',')))
                    .then(function successCallback(response) {
                        return { status: response.status, data: response.data };
                    }, function errorCallback(response) {
                        console.error('Git service:', response);
                        return { status: response.status, message: getErrorMessage(response.data.error) };
                    });
            }.bind(this);

            return {
                listProjects: listProjects,
                cloneRepository: cloneRepository,
                pullRepository: pullRepository,
                pullRepositories: pullRepositories,
                pushRepository: pushRepository,
                pushAllRepositories: pushAllRepositories,
                resetRepository: resetRepository,
                importProjects: importProjects,
                deleteRepository: deleteRepository,
                shareProject: shareProject,
                checkoutBranch: checkoutBranch,
                commit: commit,
                push: push,
                branches: branches,
                getUnstagedFiles: getUnstagedFiles,
                getStagedFiles: getStagedFiles,
                getOriginUrls: getOriginUrls,
                setFetchUrl: setFetchUrl,
                setPushUrl: setPushUrl,
                addToIndex: addToIndex,
                revertFiles: revertFiles,
                removeFiles: removeFiles,
            };
        }];
    });
