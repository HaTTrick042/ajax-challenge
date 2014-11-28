"use strict";

var commentsUrl = 'https://api.parse.com/1/classes/comments';

angular.module('CommentApp', ['ui.bootstrap'])
    .config(function($httpProvider) {

        $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = '1QTr45ii5VqkGfZXn2F2ZdijmAVEcnm1mstvBUXv';
        $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = '3ohbxKTrs8WoA1Dwb4ozzwubM3xThT5xlxTRXGIj';
    })

    .controller('CommentController', function($scope, $http) {
        $scope.refreshComments = function() {
            $http.get(commentsUrl + '?order=-score')
                .success(function(data) {
                    var sorted = data.results;
                    $scope.comments = sorted;
                });
        };
        $scope.refreshComments();

        $scope.newComment = {done: false};

        $scope.addComment = function() {
            $scope.inserting = true;
            $http.post(commentsUrl, $scope.newComment)
                .success(function(responseData) {
                    $scope.newComment.objectId = responseData.objectId;
                    $scope.comments.push($scope.newComment);
                    $scope.newComment = {done: false};
                })
                .finally(function() {
                    $scope.inserting = false;
                });
        };

        $scope.updateComments = function(comment) {
            $http.put(commentsUrl + '/' + comment.objectId, comment)
                .success(function() {
                    console.log("Comments have been updated");
                });
        };

        $scope.incrementScore = function(comment, amount) {
            var postData = {
                score: {
                    __op: "Increment",
                    amount: amount
                }
            };

            $scope.updating = true;
            $http.put(commentsUrl + '/' + comment.objectId, postData)
                .success(function(respData) {
                    comment.score = respData.score;
                })
                .error(function(err) {
                    console.log(err);
                })
                .finally(function() {
                    $scope.updating = false;
                });

        };

        $scope.deleteComment = function(comment) {
            $http.delete(commentsUrl + '/' + comment.objectId)
                .success(function() {
                    console.log("Comment deleted");
                });
        };
    });
