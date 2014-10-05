$ ->
	class Todo extends Backbone.Model
		defaults: ->
			title: 	"empty todo..."
			order: 	Todos.nextOrder()
			done: 	false

		# change state done - not done, and save 
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
				done: false

		nextOrder: ->
			return 1 if not @length # if this is first item
			@last().get('order') + 1 

		# sorts collection by order
		comparator: 'order'


	class TodoView extends Backbone.View

		tagName: 'li' 	# todo item is a li tag

		template: _.template $('#item-template').html()

		events:
			"click .toggle":		"toggleDone"
			"dblclick .view":		"edit"
			"click a.destroy":	"clear"
			"keypress .edit":		"updateOnEnter"
			"blur .edit": 			"close"

		initialize: ->
			@listenTo @model, 'change', @render
			@listenTo @model, 'destroy', @remove

		render: =>
			@$el.html @template(@model.toJSON)
			@$el.toggleClass 'done', @model.get('done')
			this.input = $('.edit')
			return this

		toggleDone: ->
			@model.toggle()

		edit: =>
			this.$(@el).addClass("editing")
			@input.focus()

		close: =>
			value = @input.val()

			if not value
				@clear()
			else
				@model.save title: value	
				this.$(@el).removeClass 'editing'

		updateOnEnter: (e) =>
			@close if e.keyCode is 13

		clear: ->
			@model.destroy


	# Application

	class AppView extends Backbone.View

		el: $('#todoapp')

		statsTemplate: _.template $('#stats-template').html()

		events:
			"keypress #new-todo":				"createOnEnter"
			"click #clear-completed":		"clearCompleted"
			"click #toggle-all":				"toggleAllComplete"

		initialize: =>
			@input = @$('#new-todo')
			@allCheckbox = @$('#toggle-all')[0]

			@listenTo Todos, 'add', 	@addOne
			@listenTo Todos, 'reset', @addAll
			@listenTo Todos, 'all', 	@render

			@footer = @$('footer')
			@main = $('#main')

			Todos.fetch()

		# rerenders the statistics
		render: =>
			done = Todos.done().length
			remaining = Todos.remaining().length

			if Todos.length
				@main.show()
				@footer.show()
				@footer.html @statsTemplate
					done: done
					remaining: remaining
			else
				@main.hide()
				@footer.hide()

			@allCheckbox.checked = not remaining

		addOne: (todo) =>
			view = new TodoView model: todo
			@$('#todo-list').append view.render().el

		addAll: =>
			Todos.each @addOne, this

		createOnEnter: (e) ->
			return if e.keyCode is 13 or not @input.val()

			Todos.create title: @input.val()
			@input.val ''

		clearCompleted: ->
			_.invoke Todos.done(), 'destroy'
			return false

		toggleAllComplete: ->
			done = @allCheckbox.checked
			Todos.each (todo) ->
				todo.save 'done': done


	Todos = new TodoList
	App = new AppView
















































