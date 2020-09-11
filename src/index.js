class List {
		token;
		notes;
		baseUrl = 'https://todo.hillel.it';

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
			})
		}

		createNoteList(){
			const noteList = document.querySelector('.note-list');
				noteList.innerHTML = '';

				this.notes.forEach(note => {

					const listItem = document.createElement('div');
					listItem.className = 'list-item';
					noteList.append(listItem);

					const p = document.createElement('p');
					p.classList.add('value');
					p.innerHTML = `id: ${note._id}, name: ${note.value.name}, content: ${note.value.content}, checked: ${note.checked}`;
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

		get showNotes(){
			const array = this.notes.reduce((acc, note) => {
				if(!acc) {
					acc = [];
				}
				const arr = {
					id: note._id,
					name: note.value.name,
					content: note.value.content,
					priority: note.priority,
					checked: note.checked,
					addedAt: note.addedAt,
				};
				acc.push(arr)
				return acc;
			}, [])
			for (let i in array) {
				console.log(array[i])
			}
			
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

	const $addNote = document.querySelector('.add-note');
	$addNote.addEventListener('click', function(e){
		e.preventDefault();
		const inputText = document.querySelector('.input').value.split(', ');
		console.log(inputText)
		todo.addNote(inputText[0], inputText[1]);
	})

	

setTimeout(()=> {
	const $removeNote = document.querySelectorAll(".remove-button");
	console.log('removeNote: ', $removeNote)
	for (let i = 0; i < $removeNote.length; i++) {
		$removeNote[i].addEventListener('click', function(e) {
			e.preventDefault()
			this.closest('.list-item').remove();
		})
	};

	const $toggleNote = document.querySelectorAll(".toggle-button");
	console.log('toggleNote: ', $toggleNote)
	for (let i = 0; i < $toggleNote.length; i++) {
		$toggleNote[i].addEventListener('click', function(e) {
			e.preventDefault()
			this.closest('.list-item').querySelector('.value').style.textDecoration = 'line-through';
		})
	};
	
}, 1000)