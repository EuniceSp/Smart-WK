window.addEventListener('load', () => {
	/**al cargar la página, vamos a tener un Json para guardar todas las tareas que haremos,
	 * y sacamos el nombre y el formulario con querySelector
	 */
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');



	/**Cuando el botón de submit del formulario reciba un click, vamos a 
	 * gyuardar todos los elementos en una constante, y les vamos a añadir categorías
	 */
	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: new Date().getTime()
		}

	/**Empujamos los anteriores valores dentro de todos, que es localStorage */

		todos.push(todo);

		/**Lo convertimos a JSON */

		localStorage.setItem('todos', JSON.stringify(todos));

		// Se resetea el formulario
		e.target.reset();

		/**Y sacamos una función que  nos muestre todas la tareas a realizar */

		DisplayTodos()
	})

	DisplayTodos()
})

/**Definimos la función para las tareas a realizar */

function DisplayTodos () {

	/**Sacamos del html el div donde se van a ir almacenando las tareas. */
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	/**Creamos un loop para ir añadiendo nuestras tareas */
	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		/**Creamos todos los elementos que va a necesitar nuestra lista
		 * y los guardamos dentro de constantes
		 */

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		/**Definimos los valores para si la tarea es de trabajo y personal 
		 * Definimos los botones para editar y borrar, y les añadimos un class
		*/

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		/**Insertamos dentro nuestro documento html */

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';

		/**Agregamos los Child dentro del Parent */

		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		/**Definimos condicional de cuando la lista esté check se cambié la clase a done */

		if (todo.done) {
			todoItem.classList.add('done');
		}

		/**Pasamos esos valores al localStorage con un addEventListener de change y los mostramos
		 * con la función DisplayTodos
		 */
		
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})

		/**Agregamos las funcionalidades de editar y eliminar con addEventListener
		 * para que una vez dado click en el botón podamos cambiar los valores dentro
		 * del localStorage y pasar a JSON, una vez editado o eliminado, se vuelve a pasar
		 * la función de DisplayTodos.
		 */

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
}