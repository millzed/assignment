var todomvc = angular.module('todomvc', ['firebase']);

todomvc.controller('TodoCtrl', function TodoCtrl($scope, $location, $firebase) {
	var fireRef = new Firebase('https://todoassignment-b9565.firebaseio.com/');
	$scope.todos = $firebase(fireRef).$asArray();
	$scope.newTodo = '';
	$scope.editedTodo = null;
	
	$scope.$watch('todos', function(){
		var total = 0;
		var remaining = 0;
		$scope.todos.forEach(function(todo){
			total++;
			if (todo.done === false) {
				remaining++;
			}
		});
		$scope.totalCount = total;
		$scope.remainingCount = remaining;
		$scope.allChecked = remaining === 0;
	}, true);

	$scope.addTodo = function(){
		var newTodo = $scope.newTodo.trim();
		if (!newTodo.length) {
			return;
		}
		$scope.todos.$add({ //post
			thing: newTodo,
			done: false
		});
		$scope.newTodo = '';
	};

	$scope.editTodo = function(todo){
		$scope.editedTodo = todo;
		$scope.originalTodo = angular.extend({}, $scope.editedTodo);
	};

	$scope.doneEditing = function(todo){
		$scope.editedTodo = null;
		var thing = todo.thing.trim();
		if (thing) {
			$scope.todos.$save(todo); //put
		} else {
			$scope.removeTodo(todo);
		}
	};

	$scope.removeTodo = function(todo){
		$scope.todos.$remove(todo); //delete
	};

	$scope.clearCompletedTodos = function(){
		angular.forEach($scope.todos, function(todo){
			if (todo.done){
				$scope.todos.$remove(todo);
			}
		});
	};

	$scope.markAll = function(allCompleted){
		console.log(allCompleted)
		angular.forEach($scope.todos, function(todo){
			todo.done = allCompleted;
			console.log(todo)
			$scope.todos.$save(todo); //put
		});
		
	};
});


todomvc.directive('todoFocus', function todoFocus($timeout){
	return function(scope, elem, attrs){
		scope.$watch(attrs.todoFocus, function(newVal){
			if (newVal){
				$timeout(function(){
					elem[0].focus();
				}, 0, false);
			}
		});
	};
});

todomvc.directive('todoBlur', function () {
	return function (scope, elem, attrs) {
		elem.bind('blur', function(){
			scope.$apply(attrs.todoBlur);
		});
	};
});