import { useEffect, useState } from "react";
import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";

import styled from "styled-components";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

const Container = styled.div`
  text-align: center;
  margin-top: 50px;
  font-family: Arial, sans-serif;
`;

const Title = styled.h1`
  color: #4a90e2;
  font-size: 2.5em;
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  background-color: #4a90e2;
  color: white;
  font-size: 1em;
  cursor: pointer;

  &:hover {
    background-color: #357ab8;
  }
`;

const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UserItem = styled.li`
  margin: 10px 0;
  font-size: 1.2em;
`;

const EditButton = styled.button`
  margin-left: 10px;
  background-color: #f0ad4e;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #ec971f;
  }
`;

const DeleteButton = styled.button`
  margin-left: 10px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: #c9302c;
  }
`;

function App() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    setUsers(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const addUser = async () => {
    if (name.trim() && age.trim()) {
      await addDoc(collection(db, "users"), { name, age: Number(age) });
      setName("");
      setAge("");
      fetchUsers();
    }
  };

  const updateUser = async () => {
    if (editingId && name.trim() && age.trim()) {
      await updateDoc(doc(db, "users", editingId), { name, age: Number(age) });
      setEditingId(null);
      setName("");
      setAge("");
      fetchUsers();
    }
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    fetchUsers();
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const chartData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: "Edad",
        data: users.map((user) => user.age),
        backgroundColor: "blue",
      },
    ],
  };

  return (
    <Container>
      <Title>CRUD con Firebase y reportes</Title>

      <Input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
      />
      <Input
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="Edad"
      />

      {editingId ? (
        <Button onClick={updateUser}>Actualizar</Button>
      ) : (
        <Button onClick={addUser}>Agregar</Button>
      )}

      <UserList>
        {users.map((user) => (
          <UserItem key={user.id}>
            {user.name} - {user.age} años
            <EditButton
              onClick={() => {
                setName(user.name);
                setAge(user.age.toString());
                setEditingId(user.id);
              }}
            >
              ✏
            </EditButton>
            <DeleteButton onClick={() => deleteUser(user.id)}>🗑</DeleteButton>
          </UserItem>
        ))}
      </UserList>

      <h2>Reporte de Edades</h2>
      <Bar data={chartData} />
    </Container>
  );
}

export default App;
