class View {
  showChecked = true;
  constructor() {
    this.app = this.getElement('#root')
    this.form = this.createElement('form')
    this.input = this.createElement('input', 'input-note')
    this.input.type = 'text'
    this.input.placeholder = 'Одесса, герой'
    this.input.id = 'todo'
    this.label = this.createElement('label')
    this.label.setAttribute('for', 'todo')
    this.label.textContent = 'Введите название города и его образ через запятую'
    this.submitButton = this.createElement('button')
    this.submitButton.textContent = 'Добавить'
    this.toggleNotesButton = this.createElement('button')
    this.toggleNotesButton.textContent = 'Спрятать выделенные'
    this.toggleNotesButton.id = 'show-toggled-button'
    this.form.append(this.label, this.input, this.submitButton, this.toggleNotesButton)
    this.title = this.createElement('h1')
    this.title.textContent = 'Заметки'
    this.todoList = this.createElement('ul', 'todo-list')
    this.app.append(this.title, this.form, this.todoList)

    this._temporaryTodoText = ''
  }

  get _todoText() {
    return this.input.value
  }

  _resetInput() {
    this.input.value = ''
  }

  createElement(tag, className) {
    const element = document.createElement(tag)

    if (className) element.classList.add(className)

    return element
  }

  getElement(selector) {
    const element = document.querySelector(selector)

    return element
  }

  displayTodos(notes) {
    // Delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild)
    }

    // Show default message
    if (notes.length === 0) {
      const p = this.createElement('p')
      p.textContent = 'Заметок нет. Добавьте их!'
      this.todoList.append(p)
    } else {
      // Create notes
      notes.forEach(note => {
        const li = this.createElement('li')
        li.dataset.checked = note.checked;
        li.classList.add('list-item')
        li.id = note._id

        const span = this.createElement('span', 'value')
        span.contentEditable = true
        span.classList.add('editable')

        if (note.checked) {
          const strike = this.createElement('s')
          strike.textContent = `Это ${note.value.name}. Город ${note.value.content}`
          span.append(strike)
        } else {
          span.textContent = `Это ${note.value.name}. Город ${note.value.content}`
        }

        const checkedButton = this.createElement('button', 'toggle-button')
        checkedButton.textContent = 'Выполненные'


        const deleteButton = this.createElement('button', 'delete')
        deleteButton.textContent = 'Удалить'
        deleteButton.classList.add('delete-button')
        li.append(span, checkedButton, deleteButton)

        // Append notes
        this.todoList.append(li)
      })
    }
  }

  _initLocalListeners() {
    this.todoList.addEventListener('input', event => {
      if (event.target.className === 'editable') {
        this._temporaryTodoText = event.target.innerText
      }
    })
  }

  bindAddTodo(handler) {
    this.form.addEventListener('submit', event => {
      event.preventDefault()

      if (this._todoText) {
        handler(this._todoText)
        this._resetInput()
      }
    })
  }

  bindShowCheckedNotes(handler) {
    const showCheckedNotesButton = this.getElement('#show-toggled-button');
    showCheckedNotesButton.addEventListener('click', () => {
    this.showChecked = !this.showChecked;
    showCheckedNotesButton.innerHTML = this.showChecked ? 'Спрятать выделенные' : 'Показать выделенные';
        let checkedNotes = document.querySelectorAll('[data-checked]');
        for (let item of checkedNotes) {
          if (item.getAttribute('data-checked') === 'true' && !this.showChecked) {
            item.closest('.list-item').classList.add('hide');
          } else {
            item.closest('.list-item').classList.remove('hide');
          }
        }

    })
  }

  bindDeleteTodo(handler) {
    // Удалить заметку
      const $deleteNote = document.querySelectorAll(".delete-button");
      for (let i = 0; i < $deleteNote.length; i++) {
        $deleteNote[i].addEventListener('click', function(e) {
          e.preventDefault()
          const id =  this.closest('.list-item').id
          console.log(id)
          handler(id)
        })
      };
  }

  bindEditTodo(handler) {
    this.todoList.addEventListener('focusout', event => {
      if (this._temporaryTodoText) {
        const id = parseInt(event.target.parentElement.id)

        handler(id, this._temporaryTodoText)

      }
    })
  }

  bindToggleTodo(handler) {
     const $toggleNote = document.querySelectorAll(".toggle-button");
      for (let i = 0; i < $toggleNote.length; i++) {
        $toggleNote[i].addEventListener('click', function(e) {
          e.preventDefault()
          const id =  this.closest('.list-item').id
          console.log(id)
          handler(id)
        })
      }
    }
}