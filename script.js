const checkStatus = (response) => {
    if (response.ok) {
        return response;
    }
    throw new Error('Request was either a 404 or 500');
}

const json = (response) => response.json()

class Task extends React.Component {
    render() {
       const {task, onDelete, onComplete} = this.props;
       const {id, content, completed} = task;

       return (
        <div className="row mb-1">
            <p className="col">{content}</p>
            <button 
            onClick={() => onDelete(id)}>
                Delete
            </button>
            <input className="d-inlike-block mt-2" type="checkbox" onChange={() => onComplete(id, completed)} checked={completed} />
        </div>
       )
    }
}

class ToDoList extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            new_task : '',
            tasks: [],
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchTasks = this.fetchTasks.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
    }

    componentDidMount() {
        this.fetchTasks();
    }

    fetchTasks() {
        fetch("https://fewd-todolist-api.onrender.com/tasks?api_key=1209")
        .then(checkStatus)
        .then(json)
        .then((response) => {
            console.log(response);
            this.setState({tasks: response.tasks});
        })
        .catch(error => {
            console.error(error.message);
        })
    }

    handleChange(event) {
        this.setState({new_task: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let {new_task} = this.state;
        new_task = new_task.trim();
        if (!new_task) {
            return;
        }

        fetch("https://fewd-todolist-api.onrender.com/tasks?api_key=1209", {
            method: "POST",
            mode: "cors",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({
                task: {
                    content: new_task
                }
            }),
        }).then(checkStatus)
        .then(json)
        .then((data) => {
            this.setState({new_task: ''});
            this.fetchTasks();
        })
        .catch((error) => {
            this.setState({error: error.message});
        })
    }

    deleteTask(id) {
        if(!id) {
            return; //if no id is supplied, early return
        }

        fetch(`https://fewd-todolist-api.onrender.com/tasks/${id}api_key=1209`, {
            method: "DELETE",
            mode: "cors",
        }).then(checkStatus)
        .then(json)
        .then((data) => {
            this.fetchTasks(); //fetch tasks after delete
        })
        .catch((error) => {
            this.setState({error: error.message});
            console.log(error);
        })
    }

    render() {
        const {new_task, tasks} = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-3">To Do List</h2>
                        {tasks.length > 0 ? tasks.map((task) => {
                            return <Task key={task.id} task={task} onDelete={this.deleteTask} />
                        }) : <p>No task here</p>}
                        <form onSubmit={this.handleSubmit} className="form-inline my-4">
                            <input type="text"
                            className="form-control mr-sm-2 md-2"
                            placeholder="New task"
                            value={new_task}
                            onChange={this.handleChange} />
                            <button type="submit" className="btn btn-primary mb-2">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<ToDoList />);