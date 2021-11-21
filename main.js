console.log('Redux object: ', window.Redux);

//
// SET UP STORE
//
const { createStore } = window.Redux;
const initialState = JSON.parse(localStorage.getItem('hobby_list')) || [];

const hobbyReducer = (state = initialState, action) => {
	// action = {
	// 	type: 'string',
	// 	payload: 'string',
	// };

	switch (action.type) {
		case 'ADD_HOBBY': {
			const newList = [...state];
			newList.push(action.payload);

			return newList;
		}
		default:
			return state;
	}
};

const store = createStore(hobbyReducer);

// -----------------

// RENDER REDUX HOBBY LIST
const renderHobbyList = (hobbyList) => {
	if (!Array.isArray(hobbyList) || hobbyList.length === 0) return;

	const ulElement = document.querySelector('#hobbyListId');
	if (!ulElement) return;

	// reset previous content of ul
	ulElement.innerHTML = '';

	for (const hobby of hobbyList) {
		const liElement = document.createElement('li');
		liElement.textContent = hobby;

		ulElement.appendChild(liElement);
	}
};

// RENDER INITIAL HOBBY LIST
const initialHobbyList = store.getState();
console.log('Current state: ', initialHobbyList);
renderHobbyList(initialHobbyList);

// HANDLE FORM SUBMIT
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

		console.log('ADD_HOBBY: ', hobbyTextElement.value);
		store.dispatch(action);

		// reset form
		hobbyFormElement.reset();
	};

	hobbyFormElement.addEventListener('submit', handleFormSubmit);
}

store.subscribe(() => {
	console.log('New state: ', store.getState());
	const newHobbyList = store.getState();
	renderHobbyList(newHobbyList);

	localStorage.setItem('hobby_list', JSON.stringify(newHobbyList));
});
