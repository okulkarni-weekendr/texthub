
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const CHANGE_STATE_TEXT = 'CHANGE_STATE_TEXT';

//action creators
function addTodoAction(todo){
    return {
        type: ADD_TODO,
        todo,
    }
}

//Reducers
function todos(state = [], action) {
    switch(action.type){
        case ADD_TODO:
            return state.concat(action.todo);
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id);
        case TOGGLE_TODO:
            return state.map((todo) => todo.id !== action.id ? todo:
                Object.assign({}, todo, {complete: !todo.complete})
            );
        default:
            return state;
    }
}

function goals(state = [], action) {
    switch(action.type){
        case ADD_GOAL:
            return state.concat([action.goal]);
        case REMOVE_GOAL:
            return state.filter((goal) => goal.id !== action.id);
        default:
            return state;
}}

function d3Editor(state = [], action){
    switch(action.type){
        case CHANGE_STATE_TEXT:
            return action.nest;
        default:
            return state;
    }
}

function app(state = {}, action){
    return {
        todos: todos(state.todos, action),
        goals: goals(state.goals, action)
    }    
}

function createStore(reducers){
    
    let state;
    let listeners = [];

    const getState = () => state;

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener)
        }
    };

    const dispatch = (action) => {
        state = reducers(state, action);
        listeners.forEach((listener) => listener())
    };

    return {
        getState,
        subscribe,
        dispatch 
    }
}

const store = createStore(app);
const unsubscribe = () => store.subscribe((state) => {
    console.log('New state:', state)
});

store.dispatch(addTodoAction({
    type: 'ADD_TODO',
    todo: {
      id: 0,
      name: 'Walk the dog',
      complete: false,
    }
  }));
  
  store.dispatch(addTodoAction({
    type: 'ADD_TODO',
    todo: {
      id: 1,
      name: 'Wash the car',
      complete: false,
    }
  }));
  
  store.dispatch(addTodoAction({
    type: 'ADD_TODO',
    todo: {
      id: 2,
      name: 'Go to the gym',
      complete: true,
    }
  }));
  
  store.dispatch(addTodoAction({
    type: 'REMOVE_TODO',
    id: 1
  }));
  
  store.dispatch({
    type: 'TOGGLE_TODO',
    id: 0
  });
  
  store.dispatch({
    type: 'ADD_GOAL',
    goal: {
      id: 0,
      name: 'Learn Redux'
    }
  });
  
  store.dispatch({
    type: 'ADD_GOAL',
    goal: {
      id: 1,
      name: 'Lose 20 pounds'
    }
  });
  
  store.dispatch({
    type: 'REMOVE_GOAL',
    id: 0
  });