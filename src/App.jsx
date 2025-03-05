import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState("");

  const obtenerUsuarios = async () => {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    setUsuarios(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const agregarUsuario = async () => {
    await addDoc(collection(db, "usuarios"), { nombre });
    obtenerUsuarios();
  };

  const actualizarUsuario = async (id, nuevoNombre) => {
    await updateDoc(doc(db, "usuarios", id), { nombre: nuevoNombre });
    obtenerUsuarios();
  };

  const eliminarUsuario = async (id) => {
    await deleteDoc(doc(db, "usuarios", id));
    obtenerUsuarios();
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div>
      <h1>CRUD con Firebase</h1>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
      <button onClick={agregarUsuario}>Agregar</button>
      <ul>
        {usuarios.map((user) => (
          <li key={user.id}>
            {user.nombre}
            <button onClick={() => actualizarUsuario(user.id, prompt("Nuevo nombre", user.nombre))}>Editar</button>
            <button onClick={() => eliminarUsuario(user.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
