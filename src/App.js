import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { db } from "./firebaseConnection";
import { doc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import './App.css';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const postsRef = collection(db, "posts");
    const snapshot = await getDocs(postsRef);
    const lista = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setPosts(lista);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (idPost) {
      await updatePost();
    } else {
      await addPost();
    }
  };

  const addPost = async () => {
    await addDoc(collection(db, "posts"), { titulo, autor, mensagem });
    setTitulo('');
    setAutor('');
    setMensagem('');
    fetchPosts();
  };

  const updatePost = async () => {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, { titulo, autor, mensagem });
    setIdPost('');
    setTitulo('');
    setAutor('');
    setMensagem('');
    fetchPosts();
  };

  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
    fetchPosts();
  };

  const editPost = (post) => {
    setIdPost(post.id);
    setTitulo(post.titulo);
    setAutor(post.autor);
    setMensagem(post.mensagem);
  };

  return (
    <Container className="text-center" style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh' }}>
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 style={{ color: '#FFA500' }}>NBA Social Network</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitulo">
              <Form.Control
                type="text"
                placeholder="Digite o título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formAutor">
              <Form.Control
                type="text"
                placeholder="Autor do post"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMensagem">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Digite a mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
              />
            </Form.Group>
            <Button variant="warning" type="submit">
              {idPost ? 'Atualizar Post' : 'Cadastrar'}
            </Button>
          </Form>
          <ul className="post-list">
            {posts.map(post => (
              <Card key={post.id} className="my-3">
                <Card.Body>
                  <Card.Title>{post.titulo}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">Autor: {post.autor}</Card.Subtitle>
                  <Card.Text>{post.mensagem}</Card.Text>
                  <Button variant="danger" onClick={() => deletePost(post.id)}>Excluir</Button>
                  <Button variant="primary" onClick={() => editPost(post)}>Editar</Button>
                </Card.Body>
              </Card>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default App;