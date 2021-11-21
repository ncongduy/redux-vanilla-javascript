// CREATE LOGGER MIDDLEWARE
const logger = (reducer) => {
	return (state, action) => {
		const newState = reducer(state, action);

		if (!state || !action) return newState;

		console.group(action.type);
		console.log('current state: ', state);
		console.log('action.payload: ', action.payload);
		console.log('next state: ', newState);
		console.groupEnd();

		return newState;
	};
};

//
// SET UP STORE
//
const { createStore } = window.Redux;
const initialState = JSON.parse(localStorage.getItem('hobby_list')) || [];

const hobbyReducer = (state = initialState, action) => {
	const newList = [...state];

	switch (action.type) {
		case 'ADD_HOBBY':
			newList.push(action.payload);
			return newList;

		case 'DELETE_HOBBY':
			return newList.filter((st) => st !== action.payload);

		default:
			return state;
	}
};

const store = createStore(logger(hobbyReducer));

// -----------------

// RENDER REDUX HOBBY LIST
const renderHobbyList = (hobbyList) => {
	const ulElement = document.querySelector('#hobbyListId');
	if (!ulElement) return;

	// reset previous content of ul
	ulElement.innerHTML = '';

	if (!Array.isArray(hobbyList) || hobbyList.length === 0) return;

	for (const hobby of hobbyList) {
		const liElement = document.createElement('li');
		liElement.style = 'margin-top: 20px';
		liElement.innerHTML = `
		<span style="display:inline-block;width:100px">
			${hobby}
		</span>

		<button 
			style="background-color:#dc3545;
						color:#fff; 
						border:#dc3545;
						border-radius:2px; 
						padding:10px;
						width:80px; 
						margin-left:100px; 
						cursor:pointer;"			
			onclick="handleDelete('${hobby}')"
		>
			Delete
		</button>`;

		ulElement.appendChild(liElement);
	}
};

// RENDER INITIAL HOBBY LIST
const initialHobbyList = store.getState();
renderHobbyList(initialHobbyList);

// HANDLE ADD
const hobbyFormElement = document.querySelector('#hobbyFormId');
if (hobbyFormElement) {
	const handleFormSubmit = (e) => {
		// prevent browser from reloading
		e.preventDefault();

		const hobbyTextElement = hobbyFormElement.querySelector('#hobbyTextId');
		if (!hobbyTextElement) return;

		const action = {
			type: 'ADD_HOBBY',
			payload: hobbyTextElement.value,
		};

		store.dispatch(action);

		// reset form
		hobbyFormElement.reset();
	};

	hobbyFormElement.addEventListener('submit', handleFormSubmit);
}

// HANDLE DELETE
const handleDelete = (hobby) => {
	const action = {
		type: 'DELETE_HOBBY',
		payload: hobby,
	};

	store.dispatch(action);
};

// SUBSCRIBE WHEN STATE CHANGE
store.subscribe(() => {
	const newHobbyList = store.getState();
	renderHobbyList(newHobbyList);

	localStorage.setItem('hobby_list', JSON.stringify(newHobbyList));
});
