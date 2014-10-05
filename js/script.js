// Generated by CoffeeScript 1.8.0
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $(function() {
    var App, AppView, Todo, TodoList, TodoView, Todos;
    Todo = (function(_super) {
      __extends(Todo, _super);

      function Todo() {
        return Todo.__super__.constructor.apply(this, arguments);
      }

      Todo.prototype.defaults = function() {
        return {
          title: "empty todo...",
          order: Todos.nextOrder(),
          done: false
        };
      };

      Todo.prototype.toggle = function() {
        return this.save({
          done: !this.get("done")
        });
      };

      return Todo;

    })(Backbone.Model);
    TodoList = (function(_super) {
      __extends(TodoList, _super);

      function TodoList() {
        return TodoList.__super__.constructor.apply(this, arguments);
      }

      TodoList.prototype.model = Todo;

      TodoList.prototype.localStorage = new Backbone.LocalStorage('todos-backbone');

      TodoList.prototype.done = function() {
        return this.where({
          done: true
        });
      };

      TodoList.prototype.remaining = function() {
        return this.where({
          done: false
        });
      };

      TodoList.prototype.nextOrder = function() {
        if (!this.length) {
          return 1;
        }
        return this.last().get('order') + 1;
      };

      TodoList.prototype.comparator = 'order';

      return TodoList;

    })(Backbone.Collection);
    Todos = new TodoList;
    TodoView = (function(_super) {
      __extends(TodoView, _super);

      function TodoView() {
        return TodoView.__super__.constructor.apply(this, arguments);
      }

      TodoView.prototype.tagName = 'li';

      TodoView.prototype.template = _.template($('#item-template').html());

      TodoView.prototype.events = {
        "click .toggle": "toggle",
        "dblclick .view": "edit",
        "click a.destroy": "clear",
        "keypress .edit": "updateOnEnter",
        "blur .edit": "close"
      };

      TodoView.prototype.initialize = function() {
        this.listenTo(this.model, 'change', this.render);
        return this.listenTo(this.model, 'destroy', this.remove);
      };

      TodoView.prototype.render = function() {
        this.$el.html(this.template(this.model.toJSON));
        this.$el.toggleClass('done', this.model.get('done'));
        this.input = $('.edit');
        return this;
      };

      TodoView.prototype.toggleDone = function() {
        return this.model.toggle();
      };

      TodoView.prototype.edit = function() {
        this.$el.addClass("editing");
        return this.input.focus();
      };

      TodoView.prototype.close = function() {
        var value;
        value = this.input.val();
        if (!value) {
          return this.clear();
        } else {
          this.model.save({
            title: value
          });
          return this.$el.removeClass('editing');
        }
      };

      TodoView.prototype.updateOnEnter = function(e) {
        if (e.keyCode === 13) {
          return this.close;
        }
      };

      TodoView.prototype.clear = function() {
        return this.model.destroy;
      };

      return TodoView;

    })(Backbone.View);
    AppView = (function(_super) {
      __extends(AppView, _super);

      function AppView() {
        return AppView.__super__.constructor.apply(this, arguments);
      }

      AppView.prototype.el = $('#todoapp');

      AppView.prototype.statsTemplate = _.template($('#stats-template').html());

      AppView.prototype.events = {
        "keypress #new-todo": "createOnEnter",
        "click #clear-completed": "clearCompleted",
        "click #toggle-all": "toggleAllComplete"
      };

      AppView.prototype.initialize = function() {
        this.input = this.$('#new-todo');
        this.allCheckbox = this.$('#toggle-all')[0];
        this.listenTo(Todos, 'add', this.addOne);
        this.listenTo(Todos, 'reset', this.addAll);
        this.listenTo(Todos, 'all', this.render);
        this.footer = this.$('footer');
        this.main = $('#main');
        return Todos.fetch();
      };

      AppView.prototype.render = function() {
        var done, remaining;
        done = Todos.done().length;
        remaining = Todos.remaining().length;
        if (Todos.length) {
          this.main.show();
          this.footer.show();
          this.footer.html(this.statsTemplate({
            done: done,
            remaining: remaining
          }));
        } else {
          this.main.hide();
          this.footer.hide();
        }
        return this.allCheckbox.checked = !remaining;
      };

      AppView.prototype.addOne = function(todo) {
        var view;
        view = new TodoView({
          model: todo
        });
        return this.$('#todo-list').append(view.render().el);
      };

      AppView.prototype.addAll = function() {
        return Todos.each(this.addOne, this);
      };

      AppView.prototype.createOnEnter = function(e) {
        if (e.keyCode === 13 || !this.input.val()) {
          return;
        }
        Todos.create({
          title: this.input.val()
        });
        return this.input.val('');
      };

      AppView.prototype.clearCompleted = function() {
        _.invoke(Todos.done(), 'destroy');
        return false;
      };

      AppView.prototype.toggleAllComplete = function() {
        var done;
        done = this.allCheckbox.checked;
        return Todos.each(function(todo) {
          return todo.save({
            'done': done
          });
        });
      };

      return AppView;

    })(Backbone.View);
    return App = new AppView;
  });

}).call(this);
