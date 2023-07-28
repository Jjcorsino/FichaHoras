import React, { useState, useEffect } from 'react';
import './IdHoras.css';



function Todo() {

    // declaracion de variables y estados
    const [newTodo, setNewTodo] = useState('');
    const [newTodoTime, setNewTodoTime] = useState('');
    const [editTodoId, setEditTodoId] = useState(null);
    const [newTodoText, setNewTodoText] = useState('');
    const [accumulatedHours, setAccumulatedHours] = useState([]);
    const hours = Array.from({ length: 13 }, (_, i) => i.toString().padStart(1, ''));


    const initialTodos = localStorage.getItem('todos')
    ? JSON.parse(localStorage.getItem('todos'))
    : [];

    const [todos, setTodos] = useState(initialTodos);

    // funcion para obtener la fecha actual del sistema
    const getCurrentDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    // funcion para obtener los datos del localstorage 
    useEffect(() => {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
    }, []);

    // funcion para guardar los datos en el localstorage
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // funcion para obtener los datos del input
    useEffect(() => {
        const storedTodos = localStorage.getItem('todos');
        if (storedTodos) {
            setTodos(JSON.parse(storedTodos));
        }
    }, []);


    // funcion para obtener los datos del input 
    const handleInputChange = (event) => {
        setNewTodo(event.target.value);
    };

    // funcion para obtener los datos del select time
    const handleTimeChange = (event) => {
        const selectedTime = event.target.value;
        setNewTodoTime(selectedTime);
    };


    // funcion para editar los datos al hacer click en el boton editar
    const handleEditTodo = (todoId) => {
        const todoToEdit = todos.find((todo) => todo.id === todoId);
        setEditTodoId(todoId);
        setNewTodo(todoToEdit.description);
        setNewTodoText(todoToEdit.text);
        setNewTodoTime(todoToEdit.time);
    };

    // funcion para obtener los datos del input id
    const handleTextChange = (event) => {
        const newText = event.target.value;
        setNewTodoText(newText);
    };

    // funcion para agregar los datos al hacer click en el boton agregar
    const handleAddTodo = () => {
        const newTodoItem = {
            id: new Date().getTime(),
            text: newTodoText,
            description: newTodo,
            date: getCurrentDate(),
            time: newTodoTime,
        };

        setTodos([...todos, newTodoItem]);
        setNewTodoText('');
        setNewTodo('');
        setNewTodoTime('');
    };

    //funcion para actualizar los datos al hacer click en el boton actualizar
    const handleUpdateTodo = () => {
        if (editTodoId) {
            const updatedTodos = todos.map((todo) => {
                if (todo.id === editTodoId) {
                    return {
                        ...todo,
                        description: newTodo,
                        text: newTodoText,
                        time: newTodoTime,
                    };
                }
                return todo;
            });

            setTodos(updatedTodos);
            setEditTodoId(null);
            setNewTodo('');
            setNewTodoText('');
            setNewTodoTime('');
        }
    };


    // funcion para borrar los datos al hacer click en el boton borrar
    const handleDeleteTodo = (id) => {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
    };

    // funcion para obtener los datos del localstorage y calcular horas
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));

        // Agrupar los todos por ID y acumular las horas
        const groupedTodos = todos.reduce((accumulator, todo) => {
            const { text, time } = todo;
            if (accumulator[text]) {
                accumulator[text] += parseInt(time);
            } else {
                accumulator[text] = parseInt(time);
            }
            return accumulator;
        }, {});

        // Convertir el objeto en una lista de objetos { text, hours }
        const updatedAccumulatedHours = Object.entries(groupedTodos).map(([text, hours]) => ({
            text,
            hours,
        }));

        setAccumulatedHours(updatedAccumulatedHours);
    }, [todos]);

    const getTotalHours = () => {
        const totalHours = todos.reduce((accumulator, todo) => {
          return accumulator + parseInt(todo.time);
        }, 0);
        return totalHours;
      };

    // funcion para mostrar los datos en pantalla
    return (
        <div className="container">
            <div className='todo-container'>
                <h1>Ficha de Horas</h1>
                <input className='todo-input'
                    type="texto"
                    value={newTodoText}
                    onChange={handleTextChange}
                    placeholder="Id..."
                />
                <input className='todo-input'
                    type="text"
                    value={newTodo}
                    onChange={handleInputChange}
                    placeholder="Agregar una nueva tarea..."
                />
                <select value={newTodoTime} onChange={handleTimeChange}>
                    <option value="">Horas</option>
                    {hours.map((hour) => (
                        <option key={hour} value={hour}>
                            {hour}
                        </option>
                    ))}
                </select>

                <button onClick={editTodoId !== null ? handleUpdateTodo : handleAddTodo} disabled={!newTodo || !newTodoText || !newTodoTime}>
                    {editTodoId !== null ? 'Actualizar' : 'Cargar'}
                </button>




                {/* funcion para mostrar los datos en pantalla*/}
                <ul className="todo-list-container">
                    {todos.map((todo) => (
                        <li key={todo.id}>
                            <div>
                                ID:{todo.text} - {todo.description} - {todo.time} Horas | {todo.date}
                            </div>
                            <div className="buttons-container">
                                <button className='edit' onClick={() => handleEditTodo(todo.id)}>Editar</button>
                                <button onClick={() => handleDeleteTodo(todo.id)}>Borrar</button>
                            </div>


                        </li>

                    ))}

                </ul>


            </div>
            <div className="Horas">
                {accumulatedHours.map((item) => (
                    <li key={item.text}>
                        <div>ID: {item.text} | Horas: {item.hours}</div>
                    </li>
                ))}
                 <p>Total de Horas: {getTotalHours()}</p>
            </div>
        </div>
    );
}

export default Todo;

