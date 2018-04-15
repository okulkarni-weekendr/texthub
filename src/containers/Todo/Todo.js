import React, { Component } from 'react'

export default class Todo extends Component {
    constructor() {
        super();
        this.state = {
            goals: ["Goal 1", "Goal 2", "Goal 3"],
            todos: [],
            todoItem: '',
            currentgoal: '',
            value: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTodoChange = this.handleTodoChange.bind(this);
        this.handleGoalChange = this.handleGoalChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleTodoChange(event){
        this.setState({
            todoItem: event.target.value
        })
    }

    handleGoalChange(event){
        this.setState({
            currentgoal: event.target.value
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({
            todos: this.state.todos.concat([this.state.todoItem]),
            goals: this.state.goals.concat([this.state.currentgoal]),

        }, () => console.log(this.state.todos, this.state.goals))
      }
      
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Todo">Add a Todo</label>
                        <input type="text" 
                            className="form-control" 
                            value={this.state.todoItem}
                            onChange={this.handleTodoChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="Goal">Add a Goal</label>
                        <input type="text" 
                            className="form-control" 
                            value={this.state.currentgoal}
                            onChange={this.handleGoalChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">Or Select from existing Goals</label>
                        <select className="form-control" id="exampleFormControlSelect1">
                            {this.state.goals.map(goal => {
                                return <option key={goal + Math.floor(Math.random()*1000/Math.random()*10)}>{goal}</option>
                            })}
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Add Todo</button>
                </form>
            </div>
        );
    }
}
