import React, { useState,useEffect} from 'react'
import { db } from '../firebase'
import {useHistory} from 'react-router-dom'

let unsubscribe =()=>{
  
}

export default function Todo(user) {

    const[text,setText] = useState('');
    const[mytodos,setTodos] = useState([])
    const history = useHistory()
    
    useEffect(()=>{
      if(user){
        const docRef = db.collection('todos').doc(user.uid)
        unsubscribe = docRef.onSnapshot(docSnap=>{
          if(docSnap.exists){
            console.log(docSnap.data().todos)
            setTodos(docSnap.data() ? docSnap.data().todos :[]) 
          }else{
            console.log("no docs")
          }
        })
      }else {
         history.push('/login')
      }


      return ()=>{
        unsubscribe()
      }
      
    },[history, user]);

 const addTodo = ()=> {
      db.collection('todos').doc(user.uid).set({
         todos:[...mytodos,text],
      })
      .then(() => {
        // Update the state after the database operation is completed
        setTodos([...mytodos,text]);
        // Clear the input field
        setText('');
      })
      .catch((error) => {
        console.error('Error adding todo: ', error);
      });
   };
    
   
    const deleteTodo = (deleteTodo) => {
    const docRef = db.collection('todos').doc(user.uid)
    docRef.get().then((docSnap) => {
  
          const result = docSnap.data().todos.filter(todo => todo !== deleteTodo)
          docRef.update({
            todos:[...mytodos,result]
          })
          .then(() => {
            // Update the state after the database operation is completed
            setTodos([...mytodos, result]);
            // Clear the input field
            setText('');
          })
          .catch((error) => {
            console.error('Error adding todo: ', error);
          });
        })
      }
        

  
  return (
    <div className='container'>
    
    <h1 >Add work to do</h1><div className="input-field">
        <input type="text" placeholder="Add to do list!" value={text} onChange={(e)=>setText(e.target.value)} />
        </div>
    <button className="btn blue" onClick={() =>addTodo()}>ADD</button> 
    <ul className='collection'>
        {mytodos.map(todo=>{
       return <li className='collection-item' key={todo}>{todo}
          <i className='material-icons right' onClick={() =>deleteTodo(todo)}>delete</i>
          </li>     
      
      })}

    
    </ul>
    </div>
  )
}
