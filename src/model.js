class Model {
  baseUrl
  userLogin
  token
  notes = []

  constructor(baseUrl, userLogin) {
    this.baseUrl = baseUrl;
    this.userLogin = userLogin;
    this.todos = JSON.parse(localStorage.getItem('todos')) || []
  }

  auth(init){
      fetch(`${this.baseUrl}/auth/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({value: this.userLogin})
      })
      .then(response => response.json())
      .then (({ access_token}) => {
        this.token = access_token;
       init()
      })
    }

    init(onchanged) {
      fetch(`${this.baseUrl}/todo`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        this.notes = data;
        this.notes.map(note => {
          note.value = JSON.parse(note.value);
        })
        console.log('Init is done');
        console.log(this.notes)
        onchanged(this.notes)

      })
    }



  bindTodoListChanged(callback) {
    this.onTodoListChanged = callback
  }


  addTodo(todoText) {
    const arrText = todoText.split(', ');
    const value = JSON.stringify({name: arrText[0], content: arrText[1]});

    fetch(`${this.baseUrl}/todo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({value, priority: 1})
    })
    .then( response => {
      if (response.status >= 200 && response.status <=210) {
        console.log('Added')
      } else {
        throw new Error('Error add')
      }
      return response;
    })
    .then(response => response.json())
    .then(note => {
      note = {
        _id: note._id,
        user: note.user,
        value: JSON.parse(note.value),
        checked: note.checked,
        addedAt: note.addedAt
      }
    this.notes.push(note);
    this.onTodoListChanged(this.notes)
    })
  }

  editTodo(id, updatedText) {
    const arrText = updatedText.split(', ');
    const value = JSON.stringify({name: arrText[0], content: arrText[1]});

    fetch(`${this.baseUrl}/todo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({value, priority: 1})
    })
    .then( response => {
      if (response.status >= 200 && response.status <=210) {
        console.log('Edited')
      } else {
        throw new Error('Error edit')
      }
      return response;
    })
    .then(response => response.json())
    .then(note => {
      note = {
        _id: note._id,
        user: note.user,
        value: JSON.parse(note.value),
        checked: note.checked,
        addedAt: note.addedAt
      }
      this.notes = this.notes.map(n => {
          if (n._id === note._id) {
             n = note
            }
            return n
      })
      this.onTodoListChanged(this.notes)
      })
  }

  deleteTodo(id) {
    console.log('model delete')
    fetch(`${this.baseUrl}/todo/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    })
    .then( response => {
      if (response.status >= 200 && response.status <=210) {
        console.log('Deleted')
      } else {
        throw new Error('Error delete')
      }
      this.notes = this.notes.filter(note => note._id != id)
      this.onTodoListChanged(this.notes)
    })
    
  }

  toggleTodo(id) {
    fetch(`${this.baseUrl}/todo/${id}/toggle`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
    })
    .then( response => {
      if (response.status >= 200 && response.status <=210) {
       this.notes = this.notes.map(n => {
        if (n._id == id) n.checked = !n.checked
        return n
      })
       console.log('y', this.notes)
      this.onTodoListChanged(this.notes)
      } else {
        throw new Error('Error toggle')
      } 
    })
  
  }
}
