// Profile.js
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    Card,
    InputGroup,
    Image,
} from "react-bootstrap";
import { useDebounce } from "use-debounce";
import "./Profile.scss";

const defaultAnimalImg =
    "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=300&q=80";

// ... (imports e defaultAnimalImg iguais)

export default function Profile() {
    const [user, setUser] = useState({
        nome: "João Matos",
        email: "joao@email.com",
        telefone: "912345678",
    });
    const [animals, setAnimals] = useState([]);
    const [newAnimal, setNewAnimal] = useState({
        name: "",
        breed: "",
        age: "",
        type: "Cão",
        photo: "",
    });

    const [photoPreview, setPhotoPreview] = useState(null);
    const [dogBreeds, setDogBreeds] = useState([]);
    const [catBreeds, setCatBreeds] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionsRef = useRef(null);
    const [debouncedBreed] = useDebounce(newAnimal.breed, 300);

    // Fetch de raças
    useEffect(() => {
        async function fetchBreeds() {
            try {
                const [resDog, resCat] = await Promise.all([
                    fetch("https://api.thedogapi.com/v1/breeds"),
                    fetch("https://api.thecatapi.com/v1/breeds"),
                ]);
                const [dogData, catData] = await Promise.all([
                    resDog.json(),
                    resCat.json(),
                ]);
                setDogBreeds(dogData);
                setCatBreeds(catData);
            } catch (error) {
                console.error("Erro a carregar raças:", error);
            }
        }
        fetchBreeds();
    }, []);

    const breedList = useMemo(() => {
        return newAnimal.type === "Cão" ? dogBreeds : catBreeds;
    }, [newAnimal.type, dogBreeds, catBreeds]);

    // Geração de sugestões com imagem
    useEffect(() => {
        const query = debouncedBreed.trim().toLowerCase();

        // Só procurar se houver pelo menos 3 caracteres
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const domain = newAnimal.type === "Cão" ? "thedogapi" : "thecatapi";

        const filtered = breedList.filter((breed) =>
            breed.name.toLowerCase().includes(query)
        );

        const suggestions = filtered.slice(0, 7).map((breed) => {
            let imgUrl = "https://via.placeholder.com/50";
            if (breed.image?.url) {
                imgUrl = breed.image.url;
            } else if (breed.reference_image_id) {
                imgUrl = `https://cdn2.${domain}.com/images/${breed.reference_image_id}.jpg?width=60`;
            }
            return { id: breed.id, name: breed.name, imgUrl };
        });

        setSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
    }, [debouncedBreed, breedList, newAnimal.type]);

    const handleSuggestionClick = (name) => {
        setNewAnimal((prev) => ({ ...prev, breed: name }));
        setShowSuggestions(false);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const addAnimal = (e) => {
        e.preventDefault();
        if (!newAnimal.name.trim()) return alert("O nome é obrigatório!");
        setAnimals((prev) => [...prev, { ...newAnimal, id: Date.now() }]);
        setNewAnimal({ name: "", breed: "", age: "", type: "Cão", photo: "" });
        setPhotoPreview(null);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const removeAnimal = (id) => {
        setAnimals((prev) => prev.filter((a) => a.id !== id));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setPhotoPreview(null);
            setNewAnimal({ ...newAnimal, photo: "" });
            return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
            setPhotoPreview(reader.result);
            setNewAnimal((a) => ({ ...a, photo: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handlePhoneChange = (e) => {
        const valor = e.target.value;

        // Aceitar só números, até 9 caracteres
        if (/^\d{0,9}$/.test(valor)) {
            setUser((prev) => ({ ...prev, telefone: valor }));
        }
    };

    return (
        <Container className="profile-page my-5">
            <h1 className="text-center mb-4">Perfil do Usuário</h1>

            <Row className="mb-5 justify-content-center">
                <Col xs={12} md={6} className="info-pessoal">
                    <div className="campo-info">
                        <p className="texto"><strong>Nome:</strong> {user.nome}</p>
                    </div>

                    <div className="campo-info">
                        <p className="texto"><strong>Email:</strong> {user.email}</p>
                    </div>

                    <div className="campo-info">
                        <label><strong>Número de Telemóvel:</strong></label>
                        <InputGroup>
                            <input
                                type="tel"
                                className="form-control"
                                placeholder="912345678"
                                value={user.telefone}
                                onChange={handlePhoneChange}
                                maxLength={9}
                            />
                        </InputGroup>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <h2 className="mb-4">Meus Animais</h2>
                    {animals.length === 0 ? (
                        <p className="text-muted">Ainda não adicionaste nenhum animal.</p>
                    ) : (
                        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                            {animals.map(({ id, name, breed, age, type, photo }) => (
                                <Col key={id}>
                                    <Card className="animal-card shadow-sm h-100">
                                        <div className="image-wrapper">
                                            <Card.Img
                                                variant="top"
                                                src={photo || defaultAnimalImg}
                                                alt={name}
                                                loading="lazy"
                                            />
                                        </div>
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title>{name}</Card.Title>
                                            <Card.Text className="mb-2">
                                                <b>Tipo:</b> {type}<br />
                                                <b>Raça:</b> {breed || "Não especificada"}<br />
                                                <b>Idade:</b> {age || "Não especificada"} anos
                                            </Card.Text>
                                            <Button
                                                variant="outline-danger"
                                                className="mt-auto"
                                                onClick={() => removeAnimal(id)}
                                            >
                                                Remover
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Col>
            </Row>

            <Row className="mt-5 justify-content-center">
                <Col xs={12} md={6}>
                    <h3 className="mb-3">Adicionar novo animal</h3>
                    <Form onSubmit={addAnimal} autoComplete="off">
                        <Form.Group className="mb-3" controlId="animalName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nome do animal"
                                value={newAnimal.name}
                                onChange={(e) =>
                                    setNewAnimal({ ...newAnimal, name: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group
                            className="mb-3 position-relative"
                            controlId="animalBreed"
                            ref={suggestionsRef}
                        >
                            <Form.Group className="mb-3" controlId="animalType">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Select
                                    value={newAnimal.type}
                                    onChange={(e) =>
                                        setNewAnimal({
                                            ...newAnimal,
                                            type: e.target.value,
                                            breed: "",
                                        })
                                    }
                                >
                                    <option>Cão</option>
                                    <option>Gato</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Label>Raça</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Raça"
                                value={newAnimal.breed}
                                onChange={(e) =>
                                    setNewAnimal({ ...newAnimal, breed: e.target.value })
                                }
                                onFocus={() => {
                                    if (suggestions.length) setShowSuggestions(true);
                                }}
                            />
                            {showSuggestions && (
                                <div className="breed-suggestions">
                                    {suggestions.map(({ id, name, imgUrl }) => (
                                        <div
                                            key={id}
                                            className="suggestion-item"
                                            onClick={() => handleSuggestionClick(name)}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={name}
                                                className="breed-image"
                                                loading="lazy"
                                            />
                                            <span>{name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="animalAge">
                            <Form.Label>Idade (anos)</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                placeholder="Idade"
                                value={newAnimal.age}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === "" || (Number(val) >= 0 && Number.isInteger(Number(val)))) {
                                        setNewAnimal({ ...newAnimal, age: val });
                                    }
                                }}
                            />

                        </Form.Group>

                        <Form.Group className="mb-4" controlId="animalPhoto">
                            <Form.Label>Foto</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                            {photoPreview && (
                                <div className="preview-wrapper mt-3">
                                    <Image
                                        src={photoPreview}
                                        rounded
                                        thumbnail
                                        alt="Preview da foto do animal"
                                        loading="lazy"
                                        style={{ maxHeight: "180px" }}
                                    />
                                </div>
                            )}
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100">
                            Adicionar Animal
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
