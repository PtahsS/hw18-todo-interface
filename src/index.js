class List {
		token;
		notes;
		baseUrl = 'https://todo.hillel.it';
		showChecked = true;

		constructor(userLogin) {
			this.userLogin = userLogin;
				this.auth(userLogin);
		 }

		auth(userLogin){
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
				this.init();
			})
		}

		init() {
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
				this.createNoteList();
				this.eventListener();
			})
		}

		createNoteList(){
			const noteList = document.querySelector('.note-list');
				noteList.innerHTML = '';

				this.notes.forEach(note => {

					const listItem = document.createElement('div');
					listItem.className = 'list-item';
					listItem.dataset.id = note._id;
					listItem.dataset.checked = note.checked;
					noteList.append(listItem);

					const p = document.createElement('p');
					p.classList.add('value');
					if (note.checked === true) {
						p.classList.add('checked')
					} else {
						p.classList.remove('checked')
					}
					p.innerHTML = `name: ${note.value.name}, content: ${note.value.content}, id: ${note._id}, checked: ${note.checked}`;
					listItem.append(p);

					const toggleButton = document.createElement('button');
					toggleButton.className = "toggle-button";
					toggleButton.appendChild(document.createTextNode('Отметить задачу как выполненную'))
					listItem.append(toggleButton)

					const removeButton = document.createElement('button');
					removeButton.className = "remove-button";
					removeButton.appendChild(document.createTextNode('Удалить задачу'))
					listItem.append(removeButton)
				})
		}

		eventListener(){

			const $addNote = document.querySelector('.add-note');
				$addNote.addEventListener('click', function(e){
					e.preventDefault();
					const inputText = document.querySelector('.input').value.split(', ');
					console.log(inputText)
					todo.addNote(inputText[0], inputText[1]);
					document.querySelector('.input').value = '';
				})

			// Удалить заметку
			const $removeNote = document.querySelectorAll(".remove-button");
			for (let i = 0; i < $removeNote.length; i++) {
				$removeNote[i].addEventListener('click', function(e) {
					e.preventDefault()
					let val = this.closest('.list-item').querySelector('.value').innerHTML;
					todo.removeNote(parseInt(val.match(/\d+/)))
					this.closest('.list-item').remove();
				})
			};

			// Отметить заметку как выполненную
			const $toggleNote = document.querySelectorAll(".toggle-button");
			for (let i = 0; i < $toggleNote.length; i++) {
				$toggleNote[i].addEventListener('click', function(e) {
					e.preventDefault()
					let val = this.closest('.list-item').querySelector('.value').innerHTML;
					const res = todo.toggleNote(parseInt(val.match(/\d+/)))
				})
			};

			// Спрятать/показать выполненные заметки
			const toggleChecked = document.querySelector('.toggle-checked');
			toggleChecked.addEventListener('click', function() {
				this.checked = !this.checked;
				toggleChecked.innerHTML = this.checked ? 'Показать выделенные' : 'Спрятать выделенные';
				let checked = document.querySelectorAll('.checked');

				for (let item of checked) {
					if (this.checked) {
						item.closest('.list-item').classList.add('hide');
					} else {
						item.closest('.list-item').classList.remove('hide');
					}
				}

				

			})
		}

		addNote(name, content, priority=1) {
			let value = JSON.stringify({name, content})
			fetch(`${this.baseUrl}/todo`, {
				method: "POST",
				headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					value,
					priority
				})

			})
			.then(response => {
					if (response.status > 200 && response.status < 210) {
						console.log('Good addition')
						this.init();

					}
				})

		}

		removeNote(id) {
			fetch(`${this.baseUrl}/todo/${id}`, {
				method: 'DELETE',
				headers: {
					'Authorization': `Bearer ${this.token}`
				}
			})
			.then(response => {
				if (response.status === 200) {
					console.log('deleted');
					this.notes = this.notes.filter(note => {
						note.id !== id;
						this.init();
					})
					console.log('notes:', this.notes)
				}
			})
		}

		removeAllNotes(){
			const indexes = this.notes.reduce((acc, note) => {
				let index = note._id;
				if (!acc) {
			      acc = [];
			    }
			    acc.push(index);
			    return acc;
			}, [])
			console.log(indexes)
			indexes.map(index => this.removeNote(index))
			this.init();
		}

		editNote(id, name, content, confirm = true, priority = 1) {
			const value = JSON.stringify({
				name,
				content,
			});
			if(confirm) {
				fetch(`${this.baseUrl}/todo/${id}`, {
					method: 'PUT',
					headers: {
					'Authorization': `Bearer ${this.token}`,
					'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						value, 
						priority
					})
				})
				.then(response => {
					if (response.status >=200 && response.status <210) {
						console.log('Ok');
						this.init();
					}
				})
			}
		}
	}



	class TodoList extends List {
		toggleNote(id) {
			fetch(`${this.baseUrl}/todo/${id}/toggle`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${this.token}`
				}
			})
			.then(response => {
				console.log(response.status)
				if (response.status >=200 && response.status <=210) {
					console.log('toggled')
					console.log(this)
				}
				this.init()
			})
			
		}

		statistic(){
			return this.notes.reduce((acc, note) => {
				note.checked === true && acc.checked++;
				return acc;
			}, {
				total: this.notes.length,
				checked: 0
			})
		}
	}
		

	const todo = new TodoList('ptahs');

	// const $addNote = document.querySelector('.add-note');
	// $addNote.addEventListener('click', function(e){
	// 	e.preventDefault();
	// 	const inputText = document.querySelector('.input').value.split(', ');
	// 	console.log(inputText)
	// 	todo.addNote(inputText[0], inputText[1]);
	// 	document.querySelector('.input').value = '';
	// })

	

