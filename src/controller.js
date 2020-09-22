class Controller {
  constructor(model, view) {

    this.model = model
    this.view = view

//     // Explicit this binding
    this.model.bindTodoListChanged(this.onTodoListChanged)
    this.view.bindAddTodo(this.handleAddTodo)
    this.view.bindShowCheckedNotes(this.handleShowCheckedNotes)
  this.model.auth(this.onInit);
  
  }


  onInit = () => {
  	this.model.init(this.onTodoListChanged)
  }

  	// Display initial todos
    // this.onTodoListChanged(this.model.notes)
  onTodoListChanged = notes => {
    this.view.displayTodos(notes)
    this.handlers()
  }
  handlers = () => {
	    this.view._initLocalListeners()
  	   	this.view.bindDeleteTodo(this.handleDeleteTodo)
    	this.view.bindEditTodo(this.handleEditTodo)
		this.view.bindToggleTodo(this.handleToggleTodo)

  }

  handleAddTodo = todoText => {
    this.model.addTodo(todoText)
  }

  handleShowCheckedNotes = notes => {
  	onShowCheckedNotes(notes);
  }

  handleEditTodo = (id, todoText) => {
    this.model.editTodo(id, todoText)
  }

  handleDeleteTodo = id => {
    this.model.deleteTodo(id)
  }

  handleToggleTodo = id => {
    this.model.toggleTodo(id)
  }
}