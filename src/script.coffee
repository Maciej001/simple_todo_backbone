$ ->
	class Todo extends Backbone.Model
		defaults: ->
			title: 	"empty todo..."
			order: 	Todos.nextOrder()
			done: 	false

		toggle: ->
			@save
				done: not @get "done"

	class TodoList extends Backbone.Collection
		model: Todo

		localStorage: new Backbone.LocalStorage('todos-backbone')

		done: ->
			@where
				done: true

		remaining: ->
			@where
				done: true

		nextOrder: ->
			return 1 if not @length # if this is first item
			@last().get('order') + 1 

		# sorts collection by order
		comparator: 'order'

	Todos = new TodoList

	



