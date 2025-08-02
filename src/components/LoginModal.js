import React, { useContext, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { AuthModalContext } from '../contexts/AuthModalContext';
import './LoginModal.scss';

export default function LoginModal() {
    const { showModal, setShowModal } = useContext(AuthModalContext);
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    // Estado para controlar a visibilidade da password
    const [showPassword, setShowPassword] = useState(false);

    const handleClose = () => {
        setShowModal(false);
        setError(null);
        setFormData({ email: '', password: '', name: '' });
        setIsLogin(true);
        setShowPassword(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        if (isLogin) {
            if (formData.email === 'admin@villa.pt' && formData.password === '1234') {
                console.log('Login com sucesso!');
                handleClose();
            } else {
                setError('Email ou palavra-passe inválidos.');
            }
        } else {
            if (formData.name && formData.email && formData.password) {
                console.log('Registo com sucesso!');
                handleClose();
            } else {
                setError('Preenche todos os campos para te registares.');
            }
        }
    };

    return (
        <Modal show={showModal} onHide={handleClose} centered scrollable={false}>
            <Modal.Header closeButton className="modal-header-custom">
                <Modal.Title>{isLogin ? 'Iniciar Sessão' : 'Criar Conta'}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <Form onSubmit={handleSubmit}>
                    {error && (
                        <div className="text-danger text-center mb-3">{error}</div>
                    )}

                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Insere o teu email"
                            required
                            autoFocus
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" style={{ position: 'relative' }}>
                        <Form.Label>
                            Palavra-passe
                            <span 
                              onClick={toggleShowPassword} 
                              style={{ cursor: 'pointer', marginLeft: '0.5rem', verticalAlign: 'middle' }}
                              aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => { if(e.key === 'Enter' || e.key === ' ') toggleShowPassword(); }}
                            >
                                {showPassword ? <IoEye /> : <IoEyeOff />}
                            </span>
                        </Form.Label>
                        <Form.Control
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
                            required
                        />
                    </Form.Group>

                    {!isLogin && (
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="O teu nome"
                                required
                            />
                        </Form.Group>
                    )}

                    <Button type="submit" className="botao-auth">
                        {isLogin ? 'Entrar' : 'Registar'}
                    </Button>
                </Form>

                <div className="mt-3 text-center">
                    {isLogin ? (
                        <p>
                            Ainda não tens conta?{' '}
                            <Button variant="link" className="p-0" onClick={() => setIsLogin(false)}>
                                Registar
                            </Button>
                        </p>
                    ) : (
                        <p>
                            Já tens conta?{' '}
                            <Button variant="link" className="p-0" onClick={() => setIsLogin(true)}>
                                Entrar
                            </Button>
                        </p>
                    )}
                </div>
            </Modal.Body>
        </Modal>
    );
}
